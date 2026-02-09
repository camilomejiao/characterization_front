import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Checkbox,
    FormControlLabel,
    MenuItem,
    TextField,
} from "@mui/material";

//
import AlertComponent from "../../../helpers/alert/AlertComponent";

//Services
import { administratorServices } from "../../../services/AdministratorServices";
import { commonServices } from "../../../services/CommonServices";

//Enum
import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";

const validationSchema = Yup.object({
    name: Yup.string().required("El nombre es obligatorio"),
    email: Yup.string().email("Formato de email inv\u00e1lido").required("El email es obligatorio"),
    password: Yup.string()
        .min(6, "M\u00ednimo 6 caracteres")
        .required("La contrase\u00f1a es obligatoria"),
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
    const twoCol = {
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 3,
    };

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
                password: values.password,
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
                const { data, status } = await fn();
                if (status === ResponseStatusEnum.OK) {
                    set(data);
                }
            } catch {}
        };

        await load(() => administratorServices.getRoles(), setRoles);
        await load(() => commonServices.getOrganizations(), setOrganizations);
    };

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
        <Box py={2}>
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="contained" onClick={() => navigate("/admin/administrator-list")}>
                    Volver al listado
                </Button>
            </Box>

            <Box component="form" onSubmit={formik.handleSubmit}>
                <Card sx={{ borderRadius: 2 }}>
                    <CardHeader
                        title="Datos del administrador"
                        subheader="Completa la información de acceso y permisos."
                    />
                    <Divider />
                    <CardContent>
                        <Box sx={twoCol}>
                            {["name", "email", "password"].map((field) => (
                                <TextField
                                    key={field}
                                    fullWidth
                                    id={field}
                                    name={field}
                                    type={field === "password" ? "password" : "text"}
                                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                                    placeholder={
                                        field === "email"
                                            ? "correo@dominio.com"
                                            : field === "password"
                                              ? "Mínimo 6 caracteres"
                                              : "Nombre completo"
                                    }
                                    value={formik.values[field]}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched[field] && Boolean(formik.errors[field])}
                                    helperText={formik.touched[field] && formik.errors[field]}
                                />
                            ))}

                            <TextField
                                select
                                fullWidth
                                id="organization_id"
                                name="organization_id"
                                label="Organización"
                                value={formik.values.organization_id}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.organization_id &&
                                    Boolean(formik.errors.organization_id)
                                }
                                helperText={
                                    formik.touched.organization_id && formik.errors.organization_id
                                }
                            >
                                {organizations.map((r) => (
                                    <MenuItem key={r.id} value={r.id}>
                                        {r.name}
                                    </MenuItem>
                                ))}
                            </TextField>

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
                                    <MenuItem key={r.id} value={r.id}>
                                        {r.name}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="active"
                                        checked={formik.values.active === 1}
                                        onChange={(e) =>
                                            formik.setFieldValue("active", e.target.checked ? 1 : 0)
                                        }
                                    />
                                }
                                label="Activo"
                            />
                        </Box>

                        <Box mt={3}>
                            <Button type="submit" variant="contained" fullWidth>
                                {id ? "Actualizar" : "Crear"}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};
