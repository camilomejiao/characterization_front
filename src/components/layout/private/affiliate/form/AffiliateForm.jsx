import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Col, Row } from "react-bootstrap";
import {useFormik} from "formik";
import * as Yup from "yup";

//Component
import { UserInformation } from "../../../shared/user-information/UserInformation";
import { SearchUser } from "../../../shared/modal/search-user/SearchUser";
import AlertComponent from "../../../../../helpers/alert/AlertComponent";

//Enum
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";

//Services
import { commonServices } from "../../../../../helpers/services/CommonServices";
import { affiliateServices } from "../../../../../helpers/services/AffiliateServices";

//
const validationSchema = Yup.object({
    populationTypeId: Yup.string().required("Campo requerido"),
    epsId: Yup.string().required("Campo requerido"),
    affiliateTypeId: Yup.string().required("Campo requerido"),
    methodologyId: Yup.string().required("Campo requerido"),
    levelId: Yup.string().required("Campo requerido"),
    membershipClassId: Yup.string().required("Campo requerido"),
    ethnicityId: Yup.string().required("Campo requerido"),
    communityId: Yup.number().optional(),
    groupSubgroupId: Yup.number().required("Campo requerido"),
    stateId: Yup.string().required("Campo requerido"),
    sisbenScore: Yup.number().optional(),
    sisbenRegistrationDate: Yup.date().max(new Date(), "La fecha no puede ser en el futuro").optional(),
    sisbenNumber: Yup.number().optional(),
    highCost: Yup.number().optional(),
    featuresSurvival: Yup.number().optional(),
    namesake: Yup.number().optional(),
    dateOfAffiliated: Yup.date().max(new Date(), "La fecha no puede ser en el futuro").optional(),
    observations: Yup.string().max(500, "Máximo 500 caracteres").optional(),
});

//
const initialValues = {
    populationTypeId: "",
    epsId: "",
    affiliateTypeId: "",
    methodologyId: "",
    levelId: "",
    membershipClassId: "",
    ethnicityId: "",
    communityId: "",
    groupSubgroupId: "",
    stateId: "",
    sisbenScore: "",
    sisbenRegistrationDate: "",
    sisbenNumber: "",
    highCost: "",
    featuresSurvival: "",
    namesake: "",
    dateOfAffiliated: "",
    observations: "",
};

export const AffiliateForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [showModal, setShowModal] = useState(false);
    const [userData, setUserData] = useState(null);
    const [populationType, setPopulationType] = useState([]);
    const [eps, setEps] = useState([]);
    const [affiliateType, setAffiliateType] = useState([]);
    const [metodology, setMetodology] = useState([]);
    const [level, setLevel] = useState([]);
    const [membershipClass, setMembershipClass] = useState([]);
    const [ethnicity, setEthnicity] = useState([]);
    const [community, setCommunity] = useState([]);
    const [groupSubgroup, setGroupSubgroup] = useState([]);
    const [state, setState] = useState([]);

    const fetchOptions = async () => {
        const load = async (fn, set) => {
            try {
                const { data, status } = await fn();
                if (status === ResponseStatusEnum.OK) {
                    set(data);
                }
            } catch {}
        };

        await load(() => commonServices.getPopulationType(), setPopulationType);
        await load(() => commonServices.getEps(), setEps);
        await load(() => commonServices.getAffiliateType(), setAffiliateType);
        await load(() => commonServices.getMethodology(), setMetodology);
        await load(() => commonServices.getlevel(), setLevel);
        await load(() => commonServices.getMembershipClass(), setMembershipClass);
        await load(() => commonServices.getEthnicity(), setEthnicity);
        await load(() => commonServices.getCommunity(), setCommunity);
        await load(() => commonServices.getGroupAndSubgroup(), setGroupSubgroup);
        await load(() => commonServices.getAffiliatedState(), setState);
    }

    //
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            try {
                const payload = {
                    userId: userData?.id,
                    populationTypeId: Number(values.populationTypeId),
                    epsId: Number(values.epsId),
                    affiliateTypeId: Number(values.affiliateTypeId),
                    methodologyId: Number(values.methodologyId),
                    levelId: Number(values.levelId),
                    membershipClassId: Number(values.membershipClassId),
                    ethnicityId: Number(values.ethnicityId),
                    communityId: values.communityId ? Number(values.communityId) : null,
                    groupSubgroupId: values.groupSubgroupId ? Number(values.groupSubgroupId) : null,
                    stateId: Number(values.stateId),
                    sisbenScore: values.sisbenScore !== "" ? Number(values.sisbenScore) : null,
                    sisbenRegistrationDate: values.sisbenRegistrationDate || null,
                    sisbenNumber: values.sisbenNumber !== "" ? Number(values.sisbenNumber) : null,
                    highCost: values.highCost !== "" ? Number(values.highCost) : null,
                    featuresSurvival: values.featuresSurvival !== "" ? Number(values.featuresSurvival) : null,
                    namesake: values.namesake !== "" ? Number(values.namesake) : null,
                    dateOfAffiliated: values.dateOfAffiliated || null,
                    observations: values.observations || null,
                };
                let response;
                if (id) {
                    response = await affiliateServices.update(id, payload);
                } else {
                    response = await affiliateServices.create(payload);
                }

                if (response.status === ResponseStatusEnum.OK || response.status === ResponseStatusEnum.CREATE) {
                    AlertComponent.success("Afiliado guardado exitosamente");
                    navigate("/admin/affiliates-list");
                } else {
                    AlertComponent.warning("Error al guardar", response.data?.errors?.[0]?.title || "Error desconocido");
                }
            } catch (error) {
                AlertComponent.error("Error al crear el afiliado");
            }
        },
    });

    //
    const fetchAffilateData = async (id) => {
        try {
            const {data, status} = await affiliateServices.getById(id);
            if (status === ResponseStatusEnum.OK) {
                setUserData(data.user);
                await formik.setValues({
                    populationTypeId: data?.populationType?.id,
                    epsId: data?.eps?.id,
                    affiliateTypeId: data?.affiliateType?.id,
                    methodologyId: data?.methodology?.id,
                    levelId: data?.level?.id,
                    membershipClassId: data?.membershipClass?.id,
                    ethnicityId: data?.ethnicity?.id,
                    communityId: data?.community?.id,
                    groupSubgroupId: data?.groupSubgroup?.id,
                    stateId: data?.state?.id,
                    sisbenScore: data?.sisbenScore ?? "",
                    sisbenRegistrationDate: data?.sisbenRegistrationDate ?? "",
                    sisbenNumber: data?.sisbenNumber ?? "",
                    highCost: data?.highCost ?? "",
                    featuresSurvival: data?.featuresSurvival ?? "",
                    namesake: data?.namesake ?? "",
                    dateOfAffiliated: data?.dateOfAffiliated ?? "",
                    observations: data?.observations ?? "",
                });
            }
        } catch (error) {
            console.log(error, '');
        }
    }

    const handleUserSearch = (data) => {
        setUserData(data);
        setShowModal(false);
    };

    useEffect(() => {
        fetchOptions();
        setShowModal(true);
        if (id) {
            fetchAffilateData(id);
            setShowModal(false);
        }
    }, []);


    return (
        <>
            {userData && (
                <div className="container py-3">
                    <div className="d-flex justify-content-end mb-2">
                        <Button variant="contained" color="primary" onClick={() => navigate("/admin/affiliates-list")}>
                            Volver al listado
                        </Button>
                    </div>

                    {/* Informacion del usuario */}
                    <UserInformation data={userData} />

                    {/* Form */}
                    <form onSubmit={formik.handleSubmit} className="mt-4">
                        <Row className="mb-3">
                            <Col md={6}>
                                <FormControl
                                    fullWidth
                                    className="mb-3"
                                    error={formik.touched.populationTypeId && Boolean(formik.errors.populationTypeId)}
                                >
                                    <InputLabel>Tipo de Población</InputLabel>
                                    <Select
                                        {...formik.getFieldProps("populationTypeId")}
                                    >
                                        {populationType.map(opt => (
                                            <MenuItem key={opt.id} value={opt.id}>
                                                {opt.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Col>
                            <Col md={6}>
                                <FormControl
                                    fullWidth
                                    error={formik.touched.epsId && Boolean(formik.errors.epsId)}>
                                    <InputLabel>EPS</InputLabel>
                                    <Select {...formik.getFieldProps("epsId")}>
                                        {eps.map(opt =>
                                            <MenuItem key={opt.id} value={opt.id}>
                                                {opt.name} - {opt.cod}
                                            </MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <FormControl
                                    fullWidth
                                    error={formik.touched.affiliateTypeId && Boolean(formik.errors.affiliateTypeId)}
                                >
                                    <InputLabel>Tipo de Población</InputLabel>
                                    <Select
                                        {...formik.getFieldProps("affiliateTypeId")}
                                        label="Tipo de afiliado"
                                    >
                                        {affiliateType.map(opt => (
                                            <MenuItem key={opt.id} value={opt.id}>
                                                {opt.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Col>
                            <Col md={6}>
                                <FormControl
                                    fullWidth
                                    error={formik.touched.methodologyId && Boolean(formik.errors.methodologyId)}
                                >
                                    <InputLabel>Metodología</InputLabel>
                                    <Select
                                        {...formik.getFieldProps("methodologyId")}
                                        label="Metodología"
                                    >
                                        {metodology.map(opt => (
                                            <MenuItem key={opt.id} value={opt.id}>
                                                {opt.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <FormControl
                                    fullWidth
                                    error={formik.touched.levelId && Boolean(formik.errors.levelId)}
                                >
                                    <InputLabel>Nivel</InputLabel>
                                    <Select
                                        {...formik.getFieldProps("levelId")}
                                        label="Nivel"
                                    >
                                        {level.map(opt => (
                                            <MenuItem key={opt.id} value={opt.id}>
                                                {opt.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Col>
                            <Col md={6}>
                                <FormControl
                                    fullWidth
                                    error={formik.touched.membershipClassId && Boolean(formik.errors.membershipClassId)}
                                >
                                    <InputLabel>Clase de afiliación</InputLabel>
                                    <Select
                                        {...formik.getFieldProps("membershipClassId")}
                                        label="Tipo de Población"
                                    >
                                        {membershipClass.map(opt => (
                                            <MenuItem key={opt.id} value={opt.id}>
                                                {opt.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <FormControl
                                    fullWidth
                                    error={formik.touched.ethnicityId && Boolean(formik.errors.ethnicityId)}
                                >
                                    <InputLabel>Etnia</InputLabel>
                                    <Select
                                        {...formik.getFieldProps("ethnicityId")}
                                        label="Tipo de Población"
                                    >
                                        {ethnicity.map(opt => (
                                            <MenuItem key={opt.id} value={opt.id}>
                                                {opt.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Col>
                            <Col md={6}>
                                <FormControl
                                    fullWidth
                                    error={formik.touched.communityId && Boolean(formik.errors.communityId)}
                                >
                                    <InputLabel>Comunidad</InputLabel>
                                    <Select
                                        {...formik.getFieldProps("communityId")}
                                        label="Tipo de Población"
                                    >
                                        <MenuItem value="">Seleccionar opción</MenuItem>
                                        {community.map(opt => (
                                            <MenuItem key={opt.id} value={opt.id}>
                                                {opt.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <FormControl
                                    fullWidth
                                    error={formik.touched.groupSubgroupId && Boolean(formik.errors.groupSubgroupId)}
                                >
                                    <InputLabel>Grupo/Subgrupo</InputLabel>
                                    <Select
                                        {...formik.getFieldProps("groupSubgroupId")}
                                        label="Tipo de Población"
                                    >
                                        {groupSubgroup.map(opt => (
                                            <MenuItem key={opt.id} value={opt.id}>
                                                {opt.group} - {opt.subgroup}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Col>
                            <Col md={6}>
                                <FormControl
                                    fullWidth
                                    error={formik.touched.stateId && Boolean(formik.errors.stateId)}
                                >
                                    <InputLabel>Estado</InputLabel>
                                    <Select
                                        {...formik.getFieldProps("stateId")}
                                        label="Tipo de Población"
                                    >
                                        {state.map(opt => (
                                            <MenuItem key={opt.id} value={opt.id}>
                                                {opt.cod} - {opt.description}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <TextField
                                    label="Puntuación Sisben"
                                    fullWidth
                                    {...formik.getFieldProps("sisbenScore")}
                                />
                            </Col>
                            <Col md={6}>
                                <TextField
                                    label="Fecha ficha de sisben"
                                    type="date"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }} {...formik.getFieldProps("sisbenRegistrationDate")}
                                    error={formik.touched.sisbenRegistrationDate && Boolean(formik.errors.sisbenRegistrationDate)}
                                    helperText={formik.touched.sisbenRegistrationDate && formik.errors.sisbenRegistrationDate} />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <TextField
                                    label="Número de ficha"
                                    fullWidth
                                    {...formik.getFieldProps("sisbenNumber")}
                                />
                            </Col>
                            <Col md={6}>
                                <FormControl
                                    fullWidth
                                    error={formik.touched.highCost && Boolean(formik.errors.highCost)}
                                >
                                    <InputLabel>Costo Alto</InputLabel>
                                    <Select
                                        id="highCost"
                                        name="highCost"
                                        value={formik.values.highCost}
                                        {...formik.getFieldProps("highCost")}
                                        onChange={(e) => {
                                            formik.setFieldValue("highCost", e.target.value);
                                        }}
                                    >
                                        <MenuItem value="">Seleccionar opción</MenuItem>
                                        <MenuItem value={1}>Sí</MenuItem>
                                        <MenuItem value={0}>No</MenuItem>
                                    </Select>
                                </FormControl>
                            </Col>
                        </Row>

                        <Row className="mb-3" >
                            <Col md={6}>
                                <FormControl
                                    fullWidth
                                    error={formik.touched.featuresSurvival && Boolean(formik.errors.featuresSurvival)}
                                >
                                    <InputLabel>Características de supervivencia</InputLabel>
                                    <Select
                                        id="featuresSurvival"
                                        name="featuresSurvival"
                                        value={formik.values.featuresSurvival}
                                        {...formik.getFieldProps("featuresSurvival")}
                                        onChange={(e) => {
                                            formik.setFieldValue("featuresSurvival", e.target.value);
                                        }}
                                    >
                                        <MenuItem value="">Seleccionar opción</MenuItem>
                                        <MenuItem value={1}>Sí</MenuItem>
                                        <MenuItem value={0}>No</MenuItem>
                                    </Select>
                                </FormControl>
                            </Col>

                            <Col md={6}>
                                <FormControl
                                    fullWidth
                                    error={formik.touched.namesake && Boolean(formik.errors.namesake)}
                                >
                                    <InputLabel>Homónimo</InputLabel>
                                    <Select
                                        id="namesake"
                                        name="namesake"
                                        value={formik.values.namesake}
                                        {...formik.getFieldProps("namesake")}
                                        onChange={(e) => {
                                            formik.setFieldValue("namesake", e.target.value);
                                        }}
                                    >
                                        <MenuItem value="">Seleccionar opción</MenuItem>
                                        <MenuItem value={1}>Sí</MenuItem>
                                        <MenuItem value={0}>No</MenuItem>
                                    </Select>
                                </FormControl>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <TextField
                                    label="Fecha del afiliación"
                                    type="date"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }} {...formik.getFieldProps("dateOfAffiliated")}
                                    error={formik.touched.dateOfAffiliated && Boolean(formik.errors.dateOfAffiliated)}
                                    helperText={formik.touched.dateOfAffiliated && formik.errors.dateOfAffiliated} />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={12}>
                                <TextField
                                    label="Observaciones"
                                    fullWidth
                                    multiline
                                    {...formik.getFieldProps("observations")}
                                />
                            </Col>
                        </Row>

                        <div className="text-end">
                            <Button type="submit" variant="contained" color="primary">
                                {id ? "Actualizar" : "Crear"}
                            </Button>
                        </div>
                    </form>
                </div>
            )}
            <SearchUser showModal={showModal} onUserFound={handleUserSearch} />

        </>
    )
}