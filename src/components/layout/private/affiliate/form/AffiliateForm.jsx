import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, MenuItem, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Spinner } from "react-bootstrap";

//Component
import { UserInformation } from "../../../shared/user-information/UserInformation";
import { SearchUser } from "../../../shared/modal/search-user/SearchUser";

//Helpers
import AlertComponent from "../../../../../helpers/alert/AlertComponent";

//Enum
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";

//Services
import { commonServices } from "../../../../../helpers/services/CommonServices";
import { affiliateServices } from "../../../../../helpers/services/AffiliateServices";

const toUndefIfEmpty = (v) =>
    v === '' || v === null || v === undefined ? undefined : v;

//
const initialValues = {
    populationTypeId: "",
    epsId: "",
    ipsPrimaryId: "",
    ipsDentalId: "",
    affiliateTypeId: "",
    methodologyId: "",
    levelId: "",
    membershipClassId: "",
    groupSubgroupId: "",
    affiliatedStateId: "",
    sisbenNumber: "",
    formNumber: "",
    dateOfAffiliated: "",
    observations: "",
};

//
const validationSchema = Yup.object({
    populationTypeId: Yup.string().required("Campo requerido"),
    epsId: Yup.string().required("Campo requerido"),
    ipsPrimaryId: Yup.string().required("Campo requerido"),
    ipsDentalId: Yup.string().required("Campo requerido"),
    affiliateTypeId: Yup.string().required("Campo requerido"),
    methodologyId: Yup.string().required("Campo requerido"),
    levelId: Yup.string().required("Campo requerido"),
    membershipClassId: Yup.string().required("Campo requerido"),
    groupSubgroupId: Yup.number().required("Campo requerido"),
    affiliatedStateId: Yup.string().required("Campo requerido"),
    sisbenNumber: Yup.number().optional(),
    formNumber: Yup.number().optional(),
    dateOfAffiliated: Yup.string()
        .transform(toUndefIfEmpty)
        .test('is-iso-or-undefined', 'Debe ser una fecha válida', (v) =>
            v === undefined || /^\d{4}-\d{2}-\d{2}$/.test(v)
        )
        .test('not-in-future', 'La fecha no puede ser en el futuro', (v) =>
            !v || new Date(v) <= new Date()
        )
        .optional(),
    observations: Yup.string().max(500, "Máximo 500 caracteres").optional(),
});

export const AffiliateForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [showModal, setShowModal] = useState(false);
    const [userData, setUserData] = useState(null);
    const [populationType, setPopulationType] = useState([]);
    const [eps, setEps] = useState([]);
    const [ipsPrimary, setIpsPrimary] = useState([]);
    const [ipsDental, setIpsDental] = useState([]);
    const [affiliateType, setAffiliateType] = useState([]);
    const [metodology, setMetodology] = useState([]);
    const [level, setLevel] = useState([]);
    const [membershipClass, setMembershipClass] = useState([]);
    const [groupSubgroup, setGroupSubgroup] = useState([]);
    const [state, setState] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

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
        await load(() => commonServices.getIpsPrimary(), setIpsPrimary);
        await load(() => commonServices.getIpsDental(), setIpsDental);
        await load(() => commonServices.getAffiliateType(), setAffiliateType);
        await load(() => commonServices.getMethodology(), setMetodology);
        await load(() => commonServices.getlevel(), setLevel);
        await load(() => commonServices.getMembershipClass(), setMembershipClass);
        await load(() => commonServices.getGroupAndSubgroup(), setGroupSubgroup);
        await load(() => commonServices.getAffiliatedState(), setState);
    }

    //
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            try {
                setIsLoading(true);
                const payload = {
                    ...values,
                    regimeId: 1,
                    userId: userData.id,
                    dateOfAffiliated: values.dateOfAffiliated ?? null
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
                    return;
                }

                if(response.status === ResponseStatusEnum.CONFLICT) {
                    AlertComponent.warning('Error', 'El usuario ya se encuentra registrado como afiliado');
                    return;
                }

                AlertComponent.warning(
                    response.data?.errors?.[0]?.title,
                    response?.data?.errors?.[0]?.source?.pointer[0]?.errors
                );
            } catch (error) {
                AlertComponent.error("Error al crear el afiliado");
            } finally {
                setIsLoading(false);
            }
        },
    });

    //
    const fetchAffilateData = async (id) => {
        try {
            setIsLoading(true);
            const {data, status} = await affiliateServices.getById(id);
            if (status === ResponseStatusEnum.OK) {
                setUserData(data.user);
                await formik.setValues({
                    populationTypeId: data?.populationType?.id,
                    epsId: data?.eps?.id,
                    ipsPrimaryId: data?.ipsPrimary?.id,
                    ipsDentalId: data?.ipsDental?.id,
                    affiliateTypeId: data?.affiliateType?.id,
                    methodologyId: data?.methodology?.id,
                    levelId: data?.level?.id,
                    membershipClassId: data?.membershipClass?.id,
                    groupSubgroupId: data?.groupSubgroup?.id,
                    affiliatedStateId: data?.affiliatedState?.id,
                    sisbenNumber: data?.sisbenNumber ?? "",
                    formNumber: data?.formNumber ?? "",
                    dateOfAffiliated: data?.dateOfAffiliated ?? "",
                    observations: data?.observations ?? "",
                });
            }
        } catch (error) {
            console.log(error, '');
        } finally {
            setIsLoading(false);
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

                    {isLoading && (
                        <div className="text-center spinner-container">
                            <Spinner animation="border" variant="success" />
                            <span>Cargando...</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={formik.handleSubmit} className="mt-4">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <TextField select
                                           fullWidth
                                           label="Tipo de Población" {...formik.getFieldProps("populationTypeId")}
                                           error={formik.touched.populationTypeId && Boolean(formik.errors.populationTypeId)}
                                           helperText={formik.touched.populationTypeId && formik.errors.populationTypeId}>
                                    {populationType.map((item) => (
                                        <MenuItem
                                            key={item.id}
                                            value={item.id}>
                                            {item.id} - {item.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </div>

                            <div className="col-md-6">
                                <TextField select
                                           fullWidth
                                           label="EPS" {...formik.getFieldProps("epsId")}
                                           error={formik.touched.epsId && Boolean(formik.errors.epsId)}
                                           helperText={formik.touched.epsId && formik.errors.epsId}>
                                    {eps.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name} - {item.cod}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </div>

                            <div className="col-md-6">
                                <TextField select
                                           fullWidth
                                           label="Ips Primaria" {...formik.getFieldProps("ipsPrimaryId")}
                                           error={formik.touched.ipsPrimaryId && Boolean(formik.errors.ipsPrimaryId)}
                                           helperText={formik.touched.ipsPrimaryId && formik.errors.ipsPrimaryId}>
                                    {ipsPrimary.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </div>

                            <div className="col-md-6">
                                <TextField select
                                           fullWidth
                                           label="Ips Odontologia" {...formik.getFieldProps("ipsDentalId")}
                                           error={formik.touched.ipsDentalId && Boolean(formik.errors.ipsDentalId)}
                                           helperText={formik.touched.ipsDentalId && formik.errors.ipsDentalId}>
                                    {ipsDental.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </div>

                            <div className="col-md-6">
                                <TextField select
                                           fullWidth
                                           label="Tipo de afiliado" {...formik.getFieldProps("affiliateTypeId")}
                                           error={formik.touched.affiliateTypeId && Boolean(formik.errors.affiliateTypeId)}
                                           helperText={formik.touched.affiliateTypeId && formik.errors.affiliateTypeId}>
                                    {affiliateType.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </div>

                            <div className="col-md-6">
                                <TextField select
                                           fullWidth
                                           label="Metodología" {...formik.getFieldProps("methodologyId")}
                                           error={formik.touched.methodologyId && Boolean(formik.errors.methodologyId)}
                                           helperText={formik.touched.methodologyId && formik.errors.methodologyId}>
                                    {metodology.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </div>

                            <div className="col-md-6">
                                <TextField select
                                           fullWidth
                                           label="Grupo/Subgrupo" {...formik.getFieldProps("groupSubgroupId")}
                                           error={formik.touched.groupSubgroupId && Boolean(formik.errors.groupSubgroupId)}
                                           helperText={formik.touched.groupSubgroupId && formik.errors.groupSubgroupId}>
                                    {groupSubgroup.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.group} - {item.subgroup}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </div>

                            <div className="col-md-6">
                                <TextField select
                                           fullWidth
                                           label="Nivel" {...formik.getFieldProps("levelId")}
                                           error={formik.touched.levelId && Boolean(formik.errors.levelId)}
                                           helperText={formik.touched.levelId && formik.errors.levelId}>
                                    {level.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </div>

                            <div className="col-md-6">
                                <TextField select
                                           fullWidth
                                           label="Clase de afiliación" {...formik.getFieldProps("membershipClassId")}
                                           error={formik.touched.membershipClassId && Boolean(formik.errors.membershipClassId)}
                                           helperText={formik.touched.membershipClassId && formik.errors.membershipClassId}>
                                    {membershipClass.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </div>

                            <div className="col-md-6">
                                <TextField select
                                           fullWidth
                                           label="Estado" {...formik.getFieldProps("affiliatedStateId")}
                                           error={formik.touched.affiliatedStateId && Boolean(formik.errors.affiliatedStateId)}
                                           helperText={formik.touched.affiliatedStateId && formik.errors.affiliatedStateId}>
                                    {state.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.cod} - {item.description}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </div>

                            <div className="col-md-6">
                                <TextField
                                    fullWidth
                                    label="Número de formulario EPS"
                                    {...formik.getFieldProps("formNumber")}
                                    error={formik.touched.formNumber && Boolean(formik.errors.formNumber)}
                                    helperText={formik.touched.formNumber && formik.errors.formNumber}
                                />
                            </div>

                            <div className="col-md-6">
                                <TextField
                                    fullWidth
                                    type="date" label="Fecha del afiliación EPS"
                                    InputLabelProps={{ shrink: true }} {...formik.getFieldProps("dateOfAffiliated")}
                                    error={formik.touched.dateOfAffiliated && Boolean(formik.errors.dateOfAffiliated)}
                                    helperText={formik.touched.dateOfAffiliated && formik.errors.dateOfAffiliated} />
                            </div>

                            <div className="col-md-6">
                                <TextField
                                    fullWidth
                                    label="Número de ficha sisben"
                                    {...formik.getFieldProps("sisbenNumber")}
                                    error={formik.touched.sisbenNumber && Boolean(formik.errors.sisbenNumber)}
                                    helperText={formik.touched.sisbenNumber && formik.errors.sisbenNumber}
                                />
                            </div>

                            <div className="col-md-12">
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={4}
                                    maxRows={8}
                                    label="Observaciones"
                                    {...formik.getFieldProps("observations")}
                                    error={formik.touched.observations && Boolean(formik.errors.observations)}
                                    helperText={formik.touched.observations && formik.errors.observations}
                                />
                            </div>
                        </div>

                        <div className="text-end mt-4">
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
                        </div>
                    </form>
                </div>
            )}

            <SearchUser showModal={showModal} onUserFound={handleUserSearch} />
        </>
    )
}