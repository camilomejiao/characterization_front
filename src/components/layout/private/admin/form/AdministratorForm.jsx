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

//Services
import { administratorServices } from "../../../../../helpers/services/AdministratorServices";
import { commonServices } from "../../../../../helpers/services/CommonServices";

//Enum
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";

const validationSchema = Yup.object({
    name: Yup.string().required("El nombre es obligatorio"),
    email: Yup.string().email("Formato de email inv\u00e1lido").required("El email es obligatorio"),
    password: Yup.string().min(6, "M\u00ednimo 6 caracteres").required("La contrase\u00f1a es obligatoria"),
    organization_id: Yup.string().required("El nombre de la organizaci\u00f3n es obligatorio"),
    role_id: Yup.string().required("El rol es obligatorio"),
    active: Yup.boolean(),
});

const initialValues = {
    name: "",
    email: "",
    password: "",
    organization_id: "",
    role_id: "",
    active: 1,
};

export const AdministratorForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [roles, setRoles] = useState([]);
    const [organizations, setOrganizations] = useState([]);

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            const formattedValues = {
                active: values.active ? 1 : 0,
                role_id: values.role_id,
                organization_id: values.organization_id,
                email: values.email,
                name: values.name,
                password: values.password
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

    const fetchOptions = async () => {
        const load = async (fn, set) => {
            try {
                const {data, status} = await fn();
                if (status === ResponseStatusEnum.OK) {
                    set(data);
                }
            } catch {}
        };

        await load (() => administratorServices.getRoles(), setRoles);
        await load (() => commonServices.getOrganizations(), setOrganizations);
    }

    const fetchUserData = async (id, formik) => {
        try {
            const { data, status } = await administratorServices.getById(id);
            if (status === ResponseStatusEnum.OK) {
                formik.setValues({
                    ...data,
                    organization_id: data?.organization?.id,
                    role_id: data?.role?.id,
                    active: data?.active ? 1 : 0,
                });
            }
        } catch {
            AlertComponent.warning("No se pudieron cargar los datos del usuario.");
        }
    };

    useEffect(() => {
        fetchOptions();
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
                {["name", "email", "password"].map((field) => (
                    <div className="col-md-6" key={field}>
                        <TextField
                            fullWidth
                            id={field}
                            name={field}
                            type={field === "password" ? "password" : "text"}
                            label={field.charAt(0).toUpperCase() + field.slice(1)}
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
                        id="organization_id"
                        name="organization_id"
                        label="Organización"
                        value={formik.values.organization_id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.organization_id && Boolean(formik.errors.organization_id)}
                        helperText={formik.touched.organization_id && formik.errors.organization_id}
                    >
                        {organizations.map((r) => (
                            <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
                        ))}
                    </TextField>
                </div>

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
                        {roles.map((r) => (
                            <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
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
