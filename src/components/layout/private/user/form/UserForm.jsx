import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import AlertComponent from "../../../../../helpers/alert/AlertComponent";
import {TextField, MenuItem, Button } from "@mui/material";

//Services
import { depaMuniServices } from "../../../../../helpers/services/DepaMuniServices";
import { commonServices } from "../../../../../helpers/services/CommonServices";
import { userServices } from "../../../../../helpers/services/UserServices";

//Enum
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";

const validationSchema = Yup.object({
    first_name: Yup.string().required("El primer nombre es obligatorio"),
    middle_name: Yup.string(),
    first_last_name: Yup.string().required("El primer apellido es obligatorio"),
    middle_last_name: Yup.string(),
    identification_type_id: Yup.string().required("El tipo de documento es obligatorio"),
    identification_number: Yup.number().required("El número de identificación es obligatorio"),
    birthdate: Yup.date().max(new Date(), "La fecha no puede ser en el futuro").required("La fecha de nacimiento es obligatoria"),
    email: Yup.string().email("Formato de email inválido").required("El email es obligatorio"),
    phone_number: Yup.string().required("El número de teléfono es obligatorio"),
    department_id: Yup.string().required("El departamento es obligatorio"),
    municipality_id: Yup.string().required("El municipio es obligatorio"),
    neighborhood: Yup.string().required("El barrio es obligatorio"),
    address: Yup.string().required("La dirección es obligatoria"),
    disability_type_id: Yup.string().required("La discapacidad es obligatoria"),
    gender_id: Yup.string().required("El género es obligatorio"),
    area_id: Yup.string().required("El área es obligatoria"),
    country_id: Yup.string().required("El pais es obligatorio"),
});

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
    department_id: "",
    municipality_id: "",
    neighborhood: "",
    address: "",
    disability_type_id: "",
    gender_id: "",
    area_id: "",
    country_id: "",
};

export const UserForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [departments, setDepartments] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);
    const [isMunicipalityDisabled, setIsMunicipalityDisabled] = useState(true);
    const [identificationType, setIdentificationType] = useState([]);
    const [disabilityType, setDisabilityType] = useState([]);
    const [gender, setGender] = useState([]);
    const [area, setArea] = useState([]);
    const [country, setCountry] = useState([]);

    //
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            try {
                const formattedValues = { ...values };
                console.log('formattedValues: ', formattedValues);
                const response = id
                    ? await userServices.update(id, formattedValues)
                    : await userServices.create(formattedValues);

                if ([ResponseStatusEnum.OK, ResponseStatusEnum.CREATE].includes(response.status)) {
                    AlertComponent.success("Operación realizada correctamente");
                    navigate("/admin/user-list");
                } else {
                    AlertComponent.warning("Error", response?.data?.errors?.[0]?.title);
                }
            } catch (error) {
                console.error("Error al enviar el formulario:", error);
                AlertComponent.error("Hubo un error al procesar la solicitud");
            }
        },
    });

    //
    const fetchUserData = async (id) => {
        try {
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
                    email: data?.email ?? "",
                    phone_number: data?.phoneNumber ?? "",
                    neighborhood: data?.neighborhood ?? "",
                    address: data?.address ?? "",
                    department_id: data?.department?.id ?? "",
                    municipality_id: data?.municipality?.id ?? "",
                    disability_type_id: data?.disabilityType?.id ?? "",
                    gender_id: data?.gender?.id ?? "",
                    area_id: data?.area?.id ?? "",
                    country_id: data?.country?.id ?? "",
                });
                if (data?.department?.id) {
                    fetchMunicipalities(data?.department?.id);
                    setIsMunicipalityDisabled(false);
                }
            }
        } catch (error) {
            console.error("Error al obtener datos del usuario:", error);
            AlertComponent.warning("No se pudieron cargar los datos del usuario.");
        }
    };

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
        await load(() => commonServices.getGender(), setGender);
        await load(() => commonServices.getArea(), setArea);
        await load(() => depaMuniServices.getDepartments(), setDepartments);
        await load(() => commonServices.getCountries(), setCountry);
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
        if (status === ResponseStatusEnum.OK) setMunicipalities(data);
    };

    useEffect(() => {
        fetchOptions();
        if (id) {
            fetchUserData(id);
        }
    }, []);

    return (
        <>
            <div className="d-flex justify-content-end mb-2">
                <Button variant="contained" color="primary" onClick={() => navigate("/admin/user-list")}>
                    Volver al listado
                </Button>
            </div>
            <form onSubmit={formik.handleSubmit} className="user-form">
                <div className="row g-3">
                    <div className="col-md-6">
                        <TextField
                            fullWidth
                            label="Primer Nombre"
                            {...formik.getFieldProps("first_name")}
                            error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                            helperText={formik.touched.first_name && formik.errors.first_name}
                        />
                    </div>
                    <div className="col-md-6">
                        <TextField
                            fullWidth
                            label="Segundo Nombre" {...formik.getFieldProps("middle_name")}
                            error={formik.touched.middle_name && Boolean(formik.errors.middle_name)}
                            helperText={formik.touched.middle_name && formik.errors.middle_name} />
                    </div>
                    <div className="col-md-6">
                        <TextField
                            fullWidth
                            label="Primer Apellido" {...formik.getFieldProps("first_last_name")}
                            error={formik.touched.first_last_name && Boolean(formik.errors.first_last_name)}
                            helperText={formik.touched.first_last_name && formik.errors.first_last_name} />
                    </div>
                    <div className="col-md-6">
                        <TextField
                            fullWidth
                            label="Segundo Apellido" {...formik.getFieldProps("middle_last_name")}
                            error={formik.touched.middle_last_name && Boolean(formik.errors.middle_last_name)}
                            helperText={formik.touched.middle_last_name && formik.errors.middle_last_name} />
                    </div>
                    <div className="col-md-6">
                        <TextField select
                                   fullWidth
                                   label="Tipo de identificación" {...formik.getFieldProps("identification_type_id")}
                                   error={formik.touched.identification_type_id && Boolean(formik.errors.identification_type_id)}
                                   helperText={formik.touched.identification_type_id && formik.errors.identification_type_id}>
                            {identificationType.map((item) => (
                                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                            ))}
                        </TextField>
                    </div>
                    <div className="col-md-6">
                        <TextField
                            fullWidth
                            type="number" label="Número de identificación"
                            {...formik.getFieldProps("identification_number")}
                            error={formik.touched.identification_number && Boolean(formik.errors.identification_number)}
                            helperText={formik.touched.identification_number && formik.errors.identification_number} />
                    </div>
                    <div className="col-md-6">
                        <TextField
                            fullWidth
                            type="date" label="Fecha de nacimiento"
                            InputLabelProps={{ shrink: true }} {...formik.getFieldProps("birthdate")}
                            error={formik.touched.birthdate && Boolean(formik.errors.birthdate)}
                            helperText={formik.touched.birthdate && formik.errors.birthdate} />
                    </div>
                    <div className="col-md-6">
                        <TextField select
                                   fullWidth
                                   label="Departamento"
                                   value={formik.values.department_id}
                                   onChange={handleDepartmentChange}
                                   onBlur={formik.handleBlur}
                                   error={formik.touched.department_id && Boolean(formik.errors.department_id)}
                                   helperText={formik.touched.department_id && formik.errors.department_id}>
                            {departments.map((dep) => (
                                <MenuItem key={dep.id} value={dep.id}>{dep.name}</MenuItem>
                            ))}
                        </TextField>
                    </div>
                    <div className="col-md-6">
                        <TextField select
                                   fullWidth
                                   label="Municipio" {...formik.getFieldProps("municipality_id")}
                                   disabled={isMunicipalityDisabled}
                                   error={formik.touched.municipality_id && Boolean(formik.errors.municipality_id)}
                                   helperText={formik.touched.municipality_id && formik.errors.municipality_id}>
                            {municipalities.map((m) => (
                                <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
                            ))}
                        </TextField>
                    </div>
                    <div className="col-md-6">
                        <TextField
                            fullWidth
                            label="Barrio" {...formik.getFieldProps("neighborhood")}
                            error={formik.touched.neighborhood && Boolean(formik.errors.neighborhood)}
                            helperText={formik.touched.neighborhood && formik.errors.neighborhood} />
                    </div>
                    <div className="col-md-6">
                        <TextField
                            fullWidth
                            label="Dirección" {...formik.getFieldProps("address")}
                            error={formik.touched.address && Boolean(formik.errors.address)}
                            helperText={formik.touched.address && formik.errors.address} />
                    </div>
                    <div className="col-md-6">
                        <TextField select
                                   fullWidth
                                   label="Discapacidad" {...formik.getFieldProps("disability_type_id")}
                                   error={formik.touched.disability_type_id && Boolean(formik.errors.disability_type_id)}
                                   helperText={formik.touched.disability_type_id && formik.errors.disability_type_id}>
                            {disabilityType.map((d) => (
                                <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                            ))}
                        </TextField>
                    </div>
                    <div className="col-md-6">
                        <TextField select
                                   fullWidth
                                   label="Género" {...formik.getFieldProps("gender_id")}
                                   error={formik.touched.gender_id && Boolean(formik.errors.gender_id)}
                                   helperText={formik.touched.gender_id && formik.errors.gender_id}>
                            {gender.map((g) => (
                                <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
                            ))}
                        </TextField>
                    </div>
                    <div className="col-md-6">
                        <TextField select
                                   fullWidth
                                   label="Área" {...formik.getFieldProps("area_id")}
                                   error={formik.touched.area_id && Boolean(formik.errors.area_id)}
                                   helperText={formik.touched.area_id && formik.errors.area_id}>
                            {area.map((a) => (
                                <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>
                            ))}
                        </TextField>
                    </div>
                    <div className="col-md-6">
                        <TextField select
                                   fullWidth
                                   label="Pais" {...formik.getFieldProps("country_id")}
                                   error={formik.touched.country_id && Boolean(formik.errors.country_id)}
                                   helperText={formik.touched.country_id && formik.errors.country_id}>
                            {country.map((a) => (
                                <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>
                            ))}
                        </TextField>
                    </div>
                    <div className="col-md-6">
                        <TextField
                            fullWidth
                            label="Número de teléfono" {...formik.getFieldProps("phone_number")}
                            error={formik.touched.phone_number && Boolean(formik.errors.phone_number)}
                            helperText={formik.touched.phone_number && formik.errors.phone_number} />
                    </div>
                    <div className="col-md-6">
                        <TextField
                            fullWidth
                            label="Email" {...formik.getFieldProps("email")}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email} />
                    </div>
                </div>
                <div className="text-end mt-4">
                    <button type="submit" className="btn btn-primary btn-submit">
                        {id ? "Actualizar" : "Crear"}
                    </button>
                </div>
            </form>
        </>
    );
};