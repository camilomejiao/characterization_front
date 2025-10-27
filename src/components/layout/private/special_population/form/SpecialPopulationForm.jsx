import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {Button, MenuItem, TextField} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

//Component
import { UserInformation } from "../../../shared/user-information/UserInformation";
import { SearchUser } from "../../../shared/modal/search-user/SearchUser";
import AlertComponent from "../../../../../helpers/alert/AlertComponent";

//Enum
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";

//Services
import { commonServices } from "../../../../../helpers/services/CommonServices";
import { specialPopulationServices } from "../../../../../helpers/services/SpecialPopulationServices";

//
const validationSchema = Yup.object({
    populationTypeId: Yup.string().required("Campo requerido"),
    hasEpsAffiliate: Yup.string().required("Campo requerido"),
    epsId: Yup.string().when("hasEpsAffiliate", {
        is: "1", // cuando elige "Sí"
        then: (schema) => schema.required("Campo requerido"),
        otherwise: (schema) => schema.notRequired(),
    }),
    ethnicityId: Yup.string().required("Campo requerido"),
    communityId: Yup.number().optional(),
    observations: Yup.string().max(500, "Máximo 500 caracteres").optional(),
});

//
const initialValues = {
    populationTypeId: "",
    ethnicityId: "",
    communityId: "",
    hasEpsAffiliate: "",
    epsId: "",
    observations: "",
}

export const SpecialPopulationForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [showModal, setShowModal] = useState(false);
    const [userData, setUserData] = useState(null);
    const [populationType, setPopulationType] = useState([]);
    const [ethnicity, setEthnicity] = useState([]);
    const [community, setCommunity] = useState([]);
    const [eps, setEps] = useState([]);

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
        await load(() => commonServices.getEthnicity(), setEthnicity);
        await load(() => commonServices.getCommunity(), setCommunity);
    }

    //
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            try {
                const payload = {
                    ...values,
                    userId: userData.id,
                    hasEpsAffiliate: Number(values.hasEpsAffiliate)
                };
                let response;
                if (id) {
                    response = await specialPopulationServices.update(id, payload);
                } else {
                    response = await specialPopulationServices.create(payload);
                }

                if (response.status === ResponseStatusEnum.OK || response.status === ResponseStatusEnum.CREATE) {
                    AlertComponent.success("Afiliado guardado exitosamente");
                    //navigate("/admin/affiliates-list");
                } else {
                    AlertComponent.warning(response.data?.errors?.[0]?.title, response?.data?.errors?.[0]?.source?.pointer[0]?.errors);
                }
            } catch (error) {
                AlertComponent.error("Error al crear el afiliado");
            }
        },
    });

    //
    const fetchSpecialPopulationUserData = async (id) => {
        try {
            const {data, status} = await specialPopulationServices.getById(id);
            if (status === ResponseStatusEnum.OK) {
                setUserData(data.user);
                await formik.setValues({
                    populationTypeId: data?.populationType?.id,
                    hasEpsAffiliate: data?.hasEpsAffiliate === false ? 0 : 1,
                    epsId: data?.eps?.id,
                    ethnicityId: data?.ethnicity?.id,
                    communityId: data?.community?.id,
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
            fetchSpecialPopulationUserData(id);
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
                        <div className="row g-3">
                            <div className="col-md-6">
                                <TextField select
                                           fullWidth
                                           label="Tipo de Población" {...formik.getFieldProps("populationTypeId")}
                                           error={formik.touched.populationTypeId && Boolean(formik.errors.populationTypeId)}
                                           helperText={formik.touched.populationTypeId && formik.errors.populationTypeId}>
                                    {populationType.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </div>

                            <div className="col-md-6">
                                <TextField
                                    select
                                    fullWidth
                                    label="¿Tiene EPS?"
                                    value={formik.values.hasEpsAffiliate}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        formik.setFieldValue("hasEpsAffiliate", value);
                                        if (value === "0") formik.setFieldValue("epsId", "");
                                    }}
                                    error={formik.touched.hasEpsAffiliate && Boolean(formik.errors.hasEpsAffiliate)}
                                    helperText={formik.touched.hasEpsAffiliate && formik.errors.hasEpsAffiliate}
                                >
                                    <MenuItem value="1">Sí</MenuItem>
                                    <MenuItem value="0">No</MenuItem>
                                </TextField>
                            </div>

                            <div className="col-md-6">
                                <TextField
                                    select
                                    fullWidth
                                    label="EPS"
                                    {...formik.getFieldProps("epsId")}
                                    disabled={formik.values.hasEpsAffiliate !== "1"}
                                    error={formik.touched.epsId && Boolean(formik.errors.epsId)}
                                    helperText={formik.touched.epsId && formik.errors.epsId}
                                    onChange={(e) => {
                                        formik.setFieldValue("epsId", e.target.value);
                                    }}
                                >
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
                                           label="Etnia" {...formik.getFieldProps("ethnicityId")}
                                           error={formik.touched.ethnicityId && Boolean(formik.errors.ethnicityId)}
                                           helperText={formik.touched.ethnicityId && formik.errors.ethnicityId}>
                                    {ethnicity.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </div>

                            <div className="col-md-6">
                                <TextField select
                                           fullWidth
                                           label="Comunidad" {...formik.getFieldProps("communityId")}
                                           error={formik.touched.communityId && Boolean(formik.errors.communityId)}
                                           helperText={formik.touched.communityId && formik.errors.communityId}>
                                    {community.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
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