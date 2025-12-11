import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

//
import AlertComponent from "../../../../../helpers/alert/AlertComponent";

//
import { administratorServices } from "../../../../../helpers/services/AdministratorServices";
import { depaMuniServices } from "../../../../../helpers/services/DepaMuniServices";
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";

const validationSchema = Yup.object({
    name: Yup.string().required("El nombre es obligatorio"),
    email: Yup.string().email("Formato de email inv\u00e1lido").required("El email es obligatorio"),
    password: Yup.string().min(6, "M\u00ednimo 6 caracteres").required("La contrase\u00f1a es obligatoria"),
    organization_name: Yup.string().required("El nombre de la organizaci\u00f3n es obligatorio"),
    role_id: Yup.string().required("El rol es obligatorio"),
    department_id: Yup.string().required("El departamento es obligatorio"),
    municipality_id: Yup.string().required("El municipio es obligatorio"),
    active: Yup.boolean(),
});

const initialValues = {
    name: "",
    email: "",
    password: "",
    organization_name: "",
    role_id: "",
    department_id: "",
    municipality_id: "",
    active: 1,
};

export const AdministratorForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [roles, setRoles] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);
    const [isMunicipalityDisabled, setIsMunicipalityDisabled] = useState(true);

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            const formattedValues = {
                ...values,
                active: values.active ? 1 : 0,
            };
            try {
                const response = id
                    ? await administratorServices.update(id, formattedValues)
                    : await administratorServices.create(formattedValues);
                if ([ResponseStatusEnum.OK, ResponseStatusEnum.CREATE].includes(response.status)) {
                    AlertComponent.success("Operaci\u00f3n realizada correctamente");
                    navigate("/admin/administrator-list");
                } else {
                    AlertComponent.warning("Error", response?.data?.errors?.[0]?.title);
                }
            } catch {
                AlertComponent.error("Hubo un error al procesar la solicitud");
            }
        },
    });

    const handleDepartmentChange = (e) => {
        const departmentId = e.target.value;
        formik.setFieldValue("department_id", departmentId);
        formik.setFieldValue("municipality_id", "");
        if (departmentId) {
            fetchMunicipalities(departmentId);
            setIsMunicipalityDisabled(false);
        } else {
            setMunicipalities([]);
            setIsMunicipalityDisabled(true);
        }
    };

    const fetchRoles = async () => {
        try {
            const { data, status } = await administratorServices.getRoles();
            if (status === ResponseStatusEnum.OK) setRoles(data);
        } catch {
            AlertComponent.warning("No se pudieron cargar los roles.");
        }
    };

    const fetchDepartments = async () => {
        try {
            const { data, status } = await depaMuniServices.getDepartments();
            if (status === ResponseStatusEnum.OK) setDepartments(data);
        } catch {
            AlertComponent.warning("No se pudieron cargar los departamentos.");
        }
    };

    const fetchMunicipalities = async (departmentId) => {
        try {
            const { data, status } = await depaMuniServices.getMunicipalities(departmentId);
            if (status === ResponseStatusEnum.OK) setMunicipalities(data);
        } catch {
            AlertComponent.warning("No se pudieron cargar los municipios.");
        }
    };

    const fetchUserData = async (id, formik) => {
        try {
            const { data, status } = await administratorServices.getById(id);
            if (status === ResponseStatusEnum.OK) {
                formik.setValues({
                    ...data,
                    organization_name: data?.organizationName,
                    department_id: data?.department?.id,
                    municipality_id: data?.municipality?.id,
                    role_id: data?.role?.id,
                    active: data?.active ? 1 : 0,
                });
                if (data?.department?.id) {
                    fetchMunicipalities(data.department.id);
                    setIsMunicipalityDisabled(false);
                }
            }
        } catch {
            AlertComponent.warning("No se pudieron cargar los datos del usuario.");
        }
    };

    useEffect(() => {
        fetchRoles();
        fetchDepartments();
        if (id) fetchUserData(id, formik);
    }, [id]);

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-end mb-3">
                <Button variant="primary" onClick={() => navigate("/admin/administrator-list")}>
                    Volver al listado
                </Button>
            </div>

            <Form onSubmit={formik.handleSubmit} className="row g-3">
                {["name", "email", "password", "organization_name"].map((field) => (
                    <div className="col-md-6" key={field}>
                        <TextField
                            fullWidth
                            id={field}
                            name={field}
                            type={field === "password" ? "password" : "text"}
                            label={
                                field === "organization_name"
                                    ? "Nombre de la organizaci\u00f3n"
                                    : field.charAt(0).toUpperCase() + field.slice(1)
                            }
                            value={formik.values[field]}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched[field] && Boolean(formik.errors[field])}
                            helperText={formik.touched[field] && formik.errors[field]}
                        />
                    </div>
                ))}

                <div className="col-md-6">
                    <TextField
                        select
                        fullWidth
                        id="role_id"
                        name="role_id"
                        label="Rol"
                        value={formik.values.role_id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.role_id && Boolean(formik.errors.role_id)}
                        helperText={formik.touched.role_id && formik.errors.role_id}
                    >
                        <MenuItem value="">Seleccione un rol</MenuItem>
                        {roles.map((r) => (
                            <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
                        ))}
                    </TextField>
                </div>

                <div className="col-md-6">
                    <TextField
                        select
                        fullWidth
                        id="department_id"
                        name="department_id"
                        label="Departamento"
                        value={formik.values.department_id}
                        onChange={handleDepartmentChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.department_id && Boolean(formik.errors.department_id)}
                        helperText={formik.touched.department_id && formik.errors.department_id}
                    >
                        <MenuItem value="">Seleccione un departamento</MenuItem>
                        {departments.map((d) => (
                            <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                        ))}
                    </TextField>
                </div>

                <div className="col-md-6">
                    <TextField
                        select
                        fullWidth
                        id="municipality_id"
                        name="municipality_id"
                        label="Municipio"
                        value={formik.values.municipality_id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={isMunicipalityDisabled}
                        error={formik.touched.municipality_id && Boolean(formik.errors.municipality_id)}
                        helperText={formik.touched.municipality_id && formik.errors.municipality_id}
                    >
                        <MenuItem value="">Seleccione un municipio</MenuItem>
                        {municipalities.map((m) => (
                            <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
                        ))}
                    </TextField>
                </div>

                <div className="col-md-6 d-flex align-items-center">
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="active"
                                checked={formik.values.active === 1}
                                onChange={(e) => formik.setFieldValue("active", e.target.checked ? 1 : 0)}
                            />
                        }
                        label="Activo"
                    />
                </div>

                <div className="col-12 mt-3">
                    <Button type="submit" variant="primary" className="w-100">
                        {id ? "Actualizar" : "Crear"}
                    </Button>
                </div>
            </Form>
        </div>
    );
};
