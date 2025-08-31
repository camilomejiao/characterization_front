import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import {Box, Button, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";

//Helper
import AlertComponent from "../../../../../helpers/alert/AlertComponent";

//Services
import { pqrsServices } from "../../../../../helpers/services/PqrsServices";
import { commonServices } from "../../../../../helpers/services/CommonServices";

//Enum
import { PqrsStatusEnum, ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";

//Components
import { UserInformation } from "../../../shared/user-information/UserInformation";
import { PqrsInformation } from "../pqrs-information/PqrsInformation";
import { ObservationHistory } from "../observation-history/ObservationHistory";


export const PQRSObservation = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    const [userData, setUserData] = useState(null);
    const [status, setStatus] = useState([]);

    const fetchPQRSData = async (id) => {
        try {
            const {data, status} = await pqrsServices.getById(id);
            if(status === ResponseStatusEnum.OK) {
                setUserData(data);
            }
        } catch (error) {
            console.error("Error al obtener datos del usuario:", error);
            AlertComponent.warning("No se pudieron cargar los datos del usuario.");
        }
    }

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
        await load(() => commonServices.getStatusPqrs(), setStatus);
    };

    const observationForm = useFormik({
        initialValues: {
            status: "",
            observation: "",
        },
        onSubmit: async (values, { resetForm }) => {
            try {
                const payload = {
                    applicationStatusId: values.status,
                    notification: values.observation,
                };
                const response = await pqrsServices.notificationCreate(id, payload);
                if (response.status === ResponseStatusEnum.CREATE) {
                    AlertComponent.success("Observación registrada con éxito");
                    resetForm();
                    fetchPQRSData(id); // recarga los datos
                }

                if (response.status === ResponseStatusEnum.BAD_REQUEST) {
                    AlertComponent.warning("Observación no registrada!");
                }
            } catch {
                AlertComponent.error("Error al guardar la observación");
            }
        }
    });

    useEffect(() => {
        if(id) {
            fetchOptions();
            fetchPQRSData(id);
        }
    }, []);

    return(
        <>
            <div style={{ width: "100%", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
                    {/* Botón para redirigir a "Listar" */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/admin/pqrs-list")}
                        style={{ fontWeight: "bold" }}
                    >
                        Volver al listado
                    </Button>
                </div>
                {/* Informacion del usuario */}
                <UserInformation data={userData?.user} />

                {/* */}
                <PqrsInformation data={userData} />

                {/* */}
                <ObservationHistory observations={userData?.notifications} />

                <Box component="form" onSubmit={observationForm.handleSubmit} sx={{ mt: 4 }}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Nuevo estado</InputLabel>
                        <Select
                            name="status"
                            value={observationForm.values.status}
                            onChange={observationForm.handleChange}
                            label="Nuevo estado"
                        >
                            {status.map(opt => (
                                <MenuItem key={opt.id} value={opt.id}>{opt.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        name="observation"
                        label="Observaciones / Seguimiento"
                        value={observationForm.values.observation}
                        onChange={observationForm.handleChange}
                    />

                    <Box sx={{ textAlign: "right", mt: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={userData?.applicationStatus?.id === PqrsStatusEnum.CLOSED}
                            color="primary">
                            Guardar observación
                        </Button>
                    </Box>
                </Box>
            </div>
        </>
    )
}