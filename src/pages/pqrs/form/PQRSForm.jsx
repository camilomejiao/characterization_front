import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Divider,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";

// Components
import { SearchUser } from "../../../components/shared/modal/search-user/SearchUser";
import { UserInformation } from "../../../components/shared/user-information/UserInformation";
//
import AlertComponent from "../../../helpers/alert/AlertComponent";

//Enums
import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";

//Services
import { depaMuniServices } from "../../../services/DepaMuniServices";
import { commonServices } from "../../../services/CommonServices";
import { pqrsServices } from "../../../services/PqrsServices";

//
const validationSchema = Yup.object({
    pqrs_type_id: Yup.string().required("El tipo de pqrs es obligatorio"),
    application_status_id: Yup.string().required("El status es obligatorio"),
    department_id: Yup.string().required("El departamento es obligatorio"),
    municipality_id: Yup.string().required("El municipio es obligatorio"),
    reason_id: Yup.string().required("La razón es obligatorio"),
    eps_id: Yup.string().required("La EPS es obligatoria"),
    entity: Yup.string().required("La entidad es obligatoria"),
    date_of_events: Yup.date().max(new Date(), "La fecha no puede ser en el futuro").required("La fecha del evento es obligatoria"),
    description_of_events: Yup.string().required("La descripción es obligatoria"),
    attachment: Yup.mixed().nullable().test("fileFormat", "Solo se permiten archivos PDF", value => !value || value.type === "application/pdf"),
});

const initialValues = {
    pqrs_type_id: "",
    application_status_id: "",
    department_id: "",
    municipality_id: "",
    reason_id: "",
    eps_id: "",
    entity: "",
    date_of_events: "",
    description_of_events: "",
    attachment: null,
};

export const PQRSForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [showModal, setShowModal] = useState(false);
    const [userData, setUserData] = useState(null);
    const [pqrsType, setPqrsType] = useState([]);
    const [status, setStatus] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);
    const [reason, setReason] = useState([]);
    const [eps, setEps] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const twoCol = {
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 3,
    };

    //
    const fetchOptions = async () => {
        const load = async (fn, set) => {
            try {
                const { data, status } = await fn();
                if (status === ResponseStatusEnum.OK) {
                    set(data);
                }
            } catch {}
        };

        await load(() => commonServices.getPQRSType(), setPqrsType);
        await load(() => commonServices.getStatusPqrs(), setStatus);
        await load(() => commonServices.getReasons(), setReason);
        await load(() => commonServices.getEps(), setEps);
        await load(() => depaMuniServices.getDepartments(), setDepartments);
    };

    //
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            try {
                setIsLoading(true);
                const formData = new FormData();
                formData.append("pqrsTypeId", values.pqrs_type_id);
                formData.append("applicationStatusId", values.application_status_id);
                formData.append("departmentId", values.department_id);
                formData.append("municipalityId", values.municipality_id);
                formData.append("userId", userData.id);
                formData.append("reasonId", values.reason_id);
                formData.append("epsId", values.eps_id);
                formData.append("entity", values.entity);
                formData.append("dateOfEvents", values.date_of_events);
                formData.append("descriptionOfEvents", values.description_of_events);
                if (values.attachment) formData.append("file", values.attachment);

                const response = id ? await pqrsServices.update(id, formData) : await pqrsServices.create(formData);
                if ([ResponseStatusEnum.OK, ResponseStatusEnum.CREATE].includes(response.status)) {
                    AlertComponent.success("Operación realizada correctamente");
                    navigate("/admin/pqrs-list");
                } else {
                    AlertComponent.warning("Error", response.data?.errors?.[0]?.title);
                }
            } catch (err) {
                AlertComponent.error("Error al procesar la solicitud");
            } finally {
                setIsLoading(false);
            }
        },
    });

    //
    const fetchMunicipalities = async (departmentId) => {
        try {
            const { data, status } = await depaMuniServices.getMunicipalities(departmentId);
            if (status === ResponseStatusEnum.OK) setMunicipalities(data);
        } catch(error) {
            console.log('')
        }
    };

    //
    const handleDepartmentChange = (e) => {
        const value = e.target.value;
        formik.setFieldValue("department_id", value);
        formik.setFieldValue("municipality_id", "");
        fetchMunicipalities(value);
    };

    //
    const fetchPQRSData = async (id) => {
        try {
            setIsLoading(true);
            const { data, status } = await pqrsServices.getById(id);
            if (status === ResponseStatusEnum.OK) {
                setUserData(data.user);
                await formik.setValues({
                    pqrs_type_id: data.pqrsType?.id,
                    application_status_id: data.applicationStatus?.id,
                    department_id: data.department?.id,
                    municipality_id: data.municipality?.id,
                    reason_id: data.reason?.id,
                    eps_id: data.eps?.id,
                    entity: data.entity,
                    date_of_events: data.dateOfEvents,
                    description_of_events: data.descriptionOfEvents,
                    attachment: null,
                });
                if (data.department?.id){
                    await fetchMunicipalities(data.department.id);
                }
            }
        } catch(error) {
            console.log(error, '');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUserSearch = (data) => {
        setUserData(data);
        setShowModal(false);
    };

    useEffect(() => {
        fetchOptions();
        setShowModal(true);
        if (id) {
            fetchPQRSData(id);
            setShowModal(false);
        }
    }, []);

    return (
        <>
            {userData && (
                <Box py={2}>
                    <Box display="flex" justifyContent="flex-end" mb={2}>
                        <Button variant="contained" color="primary" onClick={() => navigate("/admin/pqrs-list")}>
                            Volver al listado
                        </Button>
                    </Box>

                    <UserInformation data={userData} />

                    {isLoading && (
                        <Box display="flex" alignItems="center" justifyContent="center" gap={1} py={2}>
                            <CircularProgress size={22} />
                            <Typography variant="body2">Cargando...</Typography>
                        </Box>
                    )}

                    <Box component="form" onSubmit={formik.handleSubmit} mt={3}>
                        <Card sx={{ borderRadius: 2 }}>
                            <CardHeader
                                title="Registro de PQRS"
                                subheader="Completa los datos del caso para registrar la PQRS."
                            />
                            <Divider />
                            <CardContent>
                                <Box sx={twoCol}>
                                    <FormControl
                                        fullWidth
                                        error={formik.touched.pqrs_type_id && Boolean(formik.errors.pqrs_type_id)}
                                    >
                                        <InputLabel>Tipo de PQRS</InputLabel>
                                        <Select {...formik.getFieldProps("pqrs_type_id")}>
                                            {pqrsType.map((opt) => (
                                                <MenuItem key={opt.id} value={opt.id}>
                                                    {opt.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl
                                        fullWidth
                                        error={formik.touched.application_status_id && Boolean(formik.errors.application_status_id)}
                                    >
                                        <InputLabel>Estado</InputLabel>
                                        <Select {...formik.getFieldProps("application_status_id")}>
                                            {status.map((opt) => (
                                                <MenuItem key={opt.id} value={opt.id}>
                                                    {opt.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl
                                        fullWidth
                                        error={formik.touched.department_id && Boolean(formik.errors.department_id)}
                                    >
                                        <InputLabel>Departamento</InputLabel>
                                        <Select
                                            value={formik.values.department_id}
                                            onChange={handleDepartmentChange}
                                            onBlur={formik.handleBlur}
                                        >
                                            {departments.map((dep) => (
                                                <MenuItem key={dep.id} value={dep.id}>
                                                    {dep.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl
                                        fullWidth
                                        error={formik.touched.municipality_id && Boolean(formik.errors.municipality_id)}
                                    >
                                        <InputLabel>Municipio</InputLabel>
                                        <Select {...formik.getFieldProps("municipality_id")}>
                                            {municipalities.map((m) => (
                                                <MenuItem key={m.id} value={m.id}>
                                                    {m.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl
                                        fullWidth
                                        error={formik.touched.reason_id && Boolean(formik.errors.reason_id)}
                                    >
                                        <InputLabel>Razón</InputLabel>
                                        <Select {...formik.getFieldProps("reason_id")}>
                                            {reason.map((opt) => (
                                                <MenuItem key={opt.id} value={opt.id}>
                                                    {opt.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl
                                        fullWidth
                                        error={formik.touched.eps_id && Boolean(formik.errors.eps_id)}
                                    >
                                        <InputLabel>EPS</InputLabel>
                                        <Select {...formik.getFieldProps("eps_id")}>
                                            {eps.map((opt) => (
                                                <MenuItem key={opt.id} value={opt.id}>
                                                    {opt?.name} - {opt?.cod}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <TextField
                                        label="Entidad o IPS"
                                        fullWidth
                                        {...formik.getFieldProps("entity")}
                                        error={formik.touched.entity && Boolean(formik.errors.entity)}
                                        helperText={formik.touched.entity && formik.errors.entity}
                                    />
                                    <TextField
                                        label="Fecha del evento"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        {...formik.getFieldProps("date_of_events")}
                                        error={formik.touched.date_of_events && Boolean(formik.errors.date_of_events)}
                                        helperText={formik.touched.date_of_events && formik.errors.date_of_events}
                                    />

                                    <TextField
                                        label="Descripción del evento"
                                        multiline
                                        rows={4}
                                        fullWidth
                                        placeholder="Describe claramente lo ocurrido"
                                        {...formik.getFieldProps("description_of_events")}
                                        error={
                                            formik.touched.description_of_events &&
                                            Boolean(formik.errors.description_of_events)
                                        }
                                        helperText={
                                            formik.touched.description_of_events && formik.errors.description_of_events
                                        }
                                    />

                                    <FormControl fullWidth>
                                        <Typography variant="h6">Adjuntar soporte (PDF)</Typography>
                                        <Box
                                            onClick={() => document.getElementById("fileInput").click()}
                                            sx={{
                                                border: "2px dashed #ccc",
                                                p: 3,
                                                textAlign: "center",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <CloudUpload sx={{ fontSize: 40, color: "#777" }} />
                                            <Typography variant="body2">
                                                Arrastra o haz clic para subir archivo PDF
                                            </Typography>
                                        </Box>
                                        <input
                                            id="fileInput"
                                            type="file"
                                            accept="application/pdf"
                                            style={{ display: "none" }}
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file?.type === "application/pdf")
                                                    formik.setFieldValue("attachment", file);
                                                else formik.setFieldError(
                                                    "attachment",
                                                    "Solo se permiten archivos PDF."
                                                );
                                            }}
                                        />
                                        {formik.values.attachment && (
                                            <Typography mt={2} variant="body2">
                                                Archivo: {formik.values.attachment.name}
                                            </Typography>
                                        )}
                                        {formik.errors.attachment && (
                                            <Typography color="error" variant="body2">
                                                {formik.errors.attachment}
                                            </Typography>
                                        )}
                                    </FormControl>
                                </Box>

                                <Box display="flex" justifyContent="flex-end" mt={3}>
                                    <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
                                        {id ? "Actualizar" : "Crear"}
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            )}
            <SearchUser showModal={showModal} onUserFound={handleUserSearch} />
        </>
    );
};
