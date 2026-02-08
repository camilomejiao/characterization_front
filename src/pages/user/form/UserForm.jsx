import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Box, Button, CircularProgress, Grid, MenuItem, TextField, Typography } from "@mui/material";

//
import AlertComponent from "../../../helpers/alert/AlertComponent";

//Services
import { depaMuniServices } from "../../../services/DepaMuniServices";
import { commonServices } from "../../../services/CommonServices";
import { userServices } from "../../../services/UserServices";

//Enum
import { DefaultsSelectUserFormEnum, ResponseStatusEnum } from "../../../helpers/GlobalEnum";

const initialValues = {
    first_name: "",
    middle_name: "",
    first_last_name: "",
    middle_last_name: "",
    identification_type_id: "",
    identification_number: "",
    birthdate: "",
    email: "",
    phone_number: "",
    country_id: "",
    department_id: "",
    municipality_id: "",
    neighborhood: "",
    address: "",
    disability_type_id: "",
    sex_id: "",
    area_id: "",
    ethnicity_id: "",
};

const validationSchema = Yup.object({
    first_name: Yup.string().required("El primer nombre es obligatorio"),
    middle_name: Yup.string(),
    first_last_name: Yup.string().required("El primer apellido es obligatorio"),
    middle_last_name: Yup.string(),
    identification_type_id: Yup.string().required("El tipo de documento es obligatorio"),
    identification_number: Yup.number().required("El número de identificación es obligatorio"),
    birthdate: Yup.date().max(new Date(), "La fecha no puede ser en el futuro").required("La fecha de nacimiento es obligatoria"),
    sex_id: Yup.string().required("El sexo es obligatorio"),
    phone_number: Yup.string().notRequired(),
    department_id: Yup.string().required("El departamento es obligatorio"),
    municipality_id: Yup.string().required("El municipio es obligatorio"),
    neighborhood: Yup.string().required("El barrio es obligatorio"),
    address: Yup.string().notRequired(),
    disability_type_id: Yup.string().required("La discapacidad es obligatoria"),
    area_id: Yup.string().required("El área es obligatoria"),
    country_id: Yup.string().required("El pais es obligatorio"),
    email: Yup.string().trim().email("Formato de email inválido").transform(v => (v === '' ? undefined : v)).notRequired(),
    ethnicity_id: Yup.string().required("Campo requerido"),
});

export const UserForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [departments, setDepartments] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);
    const [isMunicipalityDisabled, setIsMunicipalityDisabled] = useState(true);
    const [identificationType, setIdentificationType] = useState([]);
    const [disabilityType, setDisabilityType] = useState([]);
    const [sex, setSex] = useState([]);
    const [area, setArea] = useState([]);
    const [country, setCountry] = useState([]);
    const [ethnicity, setEthnicity] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    //
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            try {
                setIsLoading(true);
                const formattedValues = {
                    ...values,
                    email: values.email?.trim() || undefined
                };
                const response = id
                    ? await userServices.update(id, formattedValues)
                    : await userServices.create(formattedValues);

                console.log('response: ', response);

                if ([ResponseStatusEnum.OK, ResponseStatusEnum.CREATE].includes(response.status)) {
                    AlertComponent.success("Operación realizada correctamente");
                    navigate("/admin/user-list");
                }

                if ([ResponseStatusEnum.CONFLICT].includes(response.status)) {
                    AlertComponent.warning('', response?.data?.errors[0]?.detail);
                }
            } catch (error) {
                console.error("Error al enviar el formulario:", error);
                AlertComponent.error("Hubo un error al procesar la solicitud");
            } finally {
                setIsLoading(false);
            }
        },
    });

    //
    const fetchUserData = async (id) => {
        try {
            setIsLoading(true);
            const { data, status } = await userServices.getById(id);
            if (status === ResponseStatusEnum.OK) {
                formik.setValues({
                    ...initialValues,
                    first_name: data?.firstName ?? "",
                    middle_name: data?.middleName ?? "",
                    first_last_name: data?.firstLastName ?? "",
                    middle_last_name: data?.middleLastName ?? "",
                    identification_type_id: data?.identificationType?.id ?? "",
                    identification_number: data?.identificationNumber ?? "",
                    birthdate: data?.birthdate ?? "",
                    email: data.email ?? "",
                    phone_number: data?.phoneNumber ?? "",
                    neighborhood: data?.neighborhood ?? "",
                    address: data?.address ?? "",
                    department_id: data?.department?.id ?? "",
                    municipality_id: data?.municipality?.id ?? "",
                    disability_type_id: data?.disabilityType?.id ?? "",
                    sex_id: data?.sex?.id ?? "",
                    area_id: data?.area?.id ?? "",
                    country_id: data?.country?.id ?? "",
                    ethnicity_id: data?.ethnicity?.id,
                });
                if (data?.department?.id) {
                    fetchMunicipalities(data?.department?.id);
                    setIsMunicipalityDisabled(false);
                }
            }
        } catch (error) {
            console.error("Error al obtener datos del usuario:", error);
            AlertComponent.warning("No se pudieron cargar los datos del usuario.");
        } finally {
            setIsLoading(false);
        }
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

        await load(() => commonServices.getIdentificationType(), setIdentificationType);
        await load(() => commonServices.getDisabilityType(), setDisabilityType);
        await load(() => commonServices.sex(), setSex);
        await load(() => commonServices.getArea(), setArea);
        await load(() => depaMuniServices.getDepartments(), setDepartments);
        await load(() => commonServices.getCountries(), setCountry);
        await load(() => commonServices.getEthnicity(), setEthnicity);
    };

    //
    const handleDepartmentChange = (event) => {
        const departmentId = event.target.value;
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

    //
    const fetchMunicipalities = async (id) => {
        const { data, status } = await depaMuniServices.getMunicipalities(id);
        if (status === ResponseStatusEnum.OK) {
            setMunicipalities(data);
            return data;
        }
        return [];
    };

    // --------------- Colocar municipio por defecto si existe ---------------
    const trySetDefaultMunicipality = (list) => {
        const exists = list.some((m) => m.id === DefaultsSelectUserFormEnum.municipality);
        formik.setFieldValue("municipality_id", exists ? DefaultsSelectUserFormEnum.municipality : "");
    };

    // --------------- Método genérico para seleccionar depto ---------------
    const selectDepartment = async (departmentId, { setMunicipalityDefault = false } = {}) => {
        formik.setFieldValue("department_id", departmentId);
        setIsMunicipalityDisabled(false);
        const list = await fetchMunicipalities(departmentId);
        if (setMunicipalityDefault) {
            trySetDefaultMunicipality(list);
        }
    };

    const initForm = async () => {
        await fetchOptions();

        if (id) {
            await fetchUserData(id);
            return;
        }

        //Campos por defecto al cargar la pagina
        formik.setFieldValue("identification_type_id", DefaultsSelectUserFormEnum.identification_type);
        formik.setFieldValue("country_id", DefaultsSelectUserFormEnum.country);
        await selectDepartment(DefaultsSelectUserFormEnum.department, { setMunicipalityDefault: true });
        formik.setFieldValue("ethnicity_id", DefaultsSelectUserFormEnum.ethnicity);
        formik.setFieldValue("disability_type_id", DefaultsSelectUserFormEnum.disability_type);
    };

    useEffect(() => {
        initForm();
    }, []);

    return (
        <>
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "#031b32",
                        color: "#fff",
                        "&:hover": { backgroundColor: "#21569a" },
                    }}
                    onClick={() => navigate("/admin/user-list")}
                >
                    Volver al listado
                </Button>
            </Box>

            {isLoading && (
                <Box display="flex" alignItems="center" gap={1} justifyContent="center" py={2}>
                    <CircularProgress size={22} />
                    <Typography variant="body2">Cargando...</Typography>
                </Box>
            )}

            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Primer Nombre"
                            {...formik.getFieldProps("first_name")}
                            error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                            helperText={formik.touched.first_name && formik.errors.first_name}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Segundo Nombre"
                            {...formik.getFieldProps("middle_name")}
                            error={formik.touched.middle_name && Boolean(formik.errors.middle_name)}
                            helperText={formik.touched.middle_name && formik.errors.middle_name}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Primer Apellido"
                            {...formik.getFieldProps("first_last_name")}
                            error={formik.touched.first_last_name && Boolean(formik.errors.first_last_name)}
                            helperText={formik.touched.first_last_name && formik.errors.first_last_name}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Segundo Apellido"
                            {...formik.getFieldProps("middle_last_name")}
                            error={formik.touched.middle_last_name && Boolean(formik.errors.middle_last_name)}
                            helperText={formik.touched.middle_last_name && formik.errors.middle_last_name}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            fullWidth
                            label="Tipo de identificación"
                            {...formik.getFieldProps("identification_type_id")}
                            error={formik.touched.identification_type_id && Boolean(formik.errors.identification_type_id)}
                            helperText={formik.touched.identification_type_id && formik.errors.identification_type_id}
                        >
                            {identificationType.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.id} - {item.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Número de identificación"
                            {...formik.getFieldProps("identification_number")}
                            error={formik.touched.identification_number && Boolean(formik.errors.identification_number)}
                            helperText={formik.touched.identification_number && formik.errors.identification_number}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            type="date"
                            label="Fecha de nacimiento"
                            InputLabelProps={{ shrink: true }}
                            {...formik.getFieldProps("birthdate")}
                            error={formik.touched.birthdate && Boolean(formik.errors.birthdate)}
                            helperText={formik.touched.birthdate && formik.errors.birthdate}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            fullWidth
                            label="País"
                            {...formik.getFieldProps("country_id")}
                            error={formik.touched.country_id && Boolean(formik.errors.country_id)}
                            helperText={formik.touched.country_id && formik.errors.country_id}
                        >
                            {country.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            fullWidth
                            label="Departamento"
                            value={formik.values.department_id}
                            onChange={handleDepartmentChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.department_id && Boolean(formik.errors.department_id)}
                            helperText={formik.touched.department_id && formik.errors.department_id}
                        >
                            {departments.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            fullWidth
                            label="Municipio"
                            {...formik.getFieldProps("municipality_id")}
                            disabled={isMunicipalityDisabled}
                            error={formik.touched.municipality_id && Boolean(formik.errors.municipality_id)}
                            helperText={formik.touched.municipality_id && formik.errors.municipality_id}
                        >
                            {municipalities.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Barrio"
                            {...formik.getFieldProps("neighborhood")}
                            error={formik.touched.neighborhood && Boolean(formik.errors.neighborhood)}
                            helperText={formik.touched.neighborhood && formik.errors.neighborhood}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Dirección"
                            {...formik.getFieldProps("address")}
                            error={formik.touched.address && Boolean(formik.errors.address)}
                            helperText={formik.touched.address && formik.errors.address}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            fullWidth
                            label="Discapacidad"
                            {...formik.getFieldProps("disability_type_id")}
                            error={formik.touched.disability_type_id && Boolean(formik.errors.disability_type_id)}
                            helperText={formik.touched.disability_type_id && formik.errors.disability_type_id}
                        >
                            {disabilityType.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            fullWidth
                            label="Sexo"
                            {...formik.getFieldProps("sex_id")}
                            error={formik.touched.sex_id && Boolean(formik.errors.sex_id)}
                            helperText={formik.touched.sex_id && formik.errors.sex_id}
                        >
                            {sex.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            fullWidth
                            label="Área"
                            {...formik.getFieldProps("area_id")}
                            error={formik.touched.area_id && Boolean(formik.errors.area_id)}
                            helperText={formik.touched.area_id && formik.errors.area_id}
                        >
                            {area.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Número de teléfono"
                            {...formik.getFieldProps("phone_number")}
                            error={formik.touched.phone_number && Boolean(formik.errors.phone_number)}
                            helperText={formik.touched.phone_number && formik.errors.phone_number}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Email"
                            {...formik.getFieldProps("email")}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            fullWidth
                            label="Etnia"
                            {...formik.getFieldProps("ethnicity_id")}
                            error={formik.touched.ethnicity_id && Boolean(formik.errors.ethnicity_id)}
                            helperText={formik.touched.ethnicity_id && formik.errors.ethnicity_id}
                        >
                            {ethnicity.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
                <Box display="flex" justifyContent="flex-end" mt={3}>
                    <Button
                        type="submit"
                        variant="contained"
                        disableElevation
                        sx={{
                            backgroundColor: "#2d8165",
                            color: "#fff",
                            "&:hover": { backgroundColor: "#3f8872" },
                        }}
                        disabled={isLoading}
                    >
                        {id ? "Actualizar" : "Crear"}
                    </Button>
                </Box>
            </form>
        </>
    );
};
