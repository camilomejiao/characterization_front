export const AffiliateReport = ({ data }) => {
    console.log(data);

    const img1 = "/img_escudo_pais.png";
    const img2 = "/img_salgar.png";

    const cell = {
        textAlign: 'left',
        borderLeft: '1px solid black',
        borderRight: '1px solid black',
        borderBottom: '1px solid black',
        padding: '2px',
    };

    const cellNoBottom = {
        textAlign: 'left',
        borderLeft: '1px solid black',
        borderRight: '1px solid black',
        padding: '2px',
    };

    const watermark = {
        position: 'fixed',
        top: '5%',
        left: '20%',
        zIndex: '-1',
        width: '500px',
    };

    const tableStyle = { borderCollapse: 'collapse', width: '100%', marginTop: '8px' };
    const sectionTitleCell = {
        textAlign: 'center',
        border: '1px solid black',
        padding: '4px',
        fontWeight: '700',
        backgroundColor: '#f2f4f7',
    };
    const itemCell = {
        border: '1px solid black',
        padding: '4px',
        verticalAlign: 'top',
    };
    const itemLine = {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '8px',
        fontSize: '12px',
    };
    const labelStyle = { color: '#374151' };
    const valueStyle = { fontWeight: '600' };

    const safeText = (value) => {
        if (value === null || value === undefined || value === "") return "—";
        return value;
    };

    const renderGridRows = (items, columns, keyPrefix) => {
        const rows = [];
        for (let i = 0; i < items.length; i += columns) {
            const rowItems = items.slice(i, i + columns);
            while (rowItems.length < columns) {
                rowItems.push({ label: '', value: '' });
            }
            rows.push(
                <tr key={`${keyPrefix}-${i}`}>
                    {rowItems.map((item, idx) => (
                        <td style={itemCell} key={`${keyPrefix}-${i}-${idx}`}>
                            {item.label ? (
                                <div style={itemLine}>
                                    <span style={labelStyle}>{item.label}</span>
                                    <span style={valueStyle}>{safeText(item.value)}</span>
                                </div>
                            ) : (
                                <span>&nbsp;</span>
                            )}
                        </td>
                    ))}
                </tr>,
            );
        }
        return rows;
    };

    const user = data?.user;
    const affiliate = data?.affiliate;
    const lma = Array.isArray(data?.lma) ? data.lma : [];
    const history = Array.isArray(data?.history) ? data.history : [];

    const userItems = [
        { label: "Nombre", value: `${user?.firstName ?? ""} ${user?.firstLastName ?? ""}`.trim() },
        { label: "Tipo de Documento", value: user?.identificationType?.name },
        { label: "Documento", value: user?.identificationNumber },
        { label: "Discapacidad", value: user?.disabilityType?.name || "Ninguna" },
        { label: "Sexo", value: user?.sex?.name },
        { label: "Barrio", value: user?.neighborhood },
        { label: "Área", value: user?.area?.name },
        { label: "Email", value: user?.email ?? "NO REGISTRA" },
        { label: "Dirección", value: user?.address },
        { label: "Teléfono", value: user?.phoneNumber },
    ];

    const affiliateItems = [
        { label: "Régimen", value: affiliate?.regime?.name },
        { label: "Estado de afiliación", value: affiliate?.affiliatedState?.description },
        { label: "Tipo de población", value: affiliate?.populationType?.name },
        { label: "EPS", value: affiliate?.eps?.name },
        { label: "IPS Primaria", value: affiliate?.ipsPrimary?.name || "No registra" },
        { label: "IPS Odontológica", value: affiliate?.ipsDental?.name || "No registra" },
        { label: "Tipo de afiliado", value: affiliate?.affiliateType?.name || "No registra" },
        { label: "Metodología", value: affiliate?.methodology?.name },
        { label: "Grupo y Subgrupo", value: affiliate?.groupSubgroup?.subgroup },
        { label: "Nivel", value: affiliate?.level?.name ?? "NO REGISTRA" },
        { label: "Clase de afiliación", value: affiliate?.membershipClass?.name },
        { label: "Estado de afiliación", value: affiliate?.affiliateType?.name },
        { label: "Número del formulario", value: affiliate?.formNumber },
        { label: "Etnia", value: affiliate?.ethnicity?.name },
        { label: "Fecha de afiliación", value: affiliate?.dateOfAffiliated },
        { label: "Número de ficha Sisben", value: affiliate?.sisbenNumber },
        { label: "Observaciones", value: affiliate?.observations },
    ];

    return (
        <>
            <div id='report-section'>
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr>
                            <td
                                style={{
                                    width: '15%',
                                    textAlign: 'center',
                                    border: '1px solid black',
                                }}
                            >
                                <img src={img1} alt='' style={{ height: '60px' }} />
                            </td>
                            <td
                                style={{
                                    borderTop: '1px solid black',
                                    borderBottom: '1px solid black',
                                    textAlign: 'center',
                                }}
                            >
                                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                                    <tbody>
                                        <tr>
                                            <td>DEPARTAMENTO DE CUNDINAMARCA</td>
                                        </tr>
                                        <tr>
                                            <td>MUNICIPIO DE PUERTO SALGAR</td>
                                        </tr>
                                        <tr>
                                            <td>ALCALDIA MUNICIPAL</td>
                                        </tr>
                                        <tr>
                                            <td>OFICINA DE SALUD</td>
                                        </tr>
                                        <tr>
                                            <td>FORMATO DE SOLICITUDES, QUEJAS Y RECLAMOS</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td
                                style={{
                                    width: '15%',
                                    textAlign: 'center',
                                    border: '1px solid black',
                                }}
                            >
                                <img src={img2} alt='' style={{ height: '60px' }} />
                            </td>
                        </tr>
                    </thead>
                </table>

                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <td style={sectionTitleCell}>Información del Usuario</td>
                        </tr>
                    </thead>
                    <tbody>{renderGridRows(userItems, 3, 'user')}</tbody>
                </table>

                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <td style={sectionTitleCell}>Información de la Afiliación</td>
                        </tr>
                    </thead>
                    <tbody>{renderGridRows(affiliateItems, 3, 'affiliate')}</tbody>
                </table>

                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <td style={sectionTitleCell}>Información de Pagos Realizados</td>
                        </tr>
                    </thead>
                    <tbody>
                        {lma.length === 0 ? (
                            <tr>
                                <td style={itemCell}>
                                    <div style={itemLine}>
                                        <span style={labelStyle}>Registros</span>
                                        <span style={valueStyle}>No hay pagos registrados</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            lma.map((pays, idx) => (
                                <tr key={`lma-${idx}`}>
                                    <td style={itemCell}>
                                        <div style={itemLine}>
                                            <span style={labelStyle}>Mes</span>
                                            <span style={valueStyle}>{safeText(pays?.month)}</span>
                                        </div>
                                    </td>
                                    <td style={itemCell}>
                                        <div style={itemLine}>
                                            <span style={labelStyle}>Año</span>
                                            <span style={valueStyle}>{safeText(pays?.year)}</span>
                                        </div>
                                    </td>
                                    <td style={itemCell}>
                                        <div style={itemLine}>
                                            <span style={labelStyle}>Valor pagado</span>
                                            <span style={valueStyle}>
                                                {pays?.paid != null
                                                    ? `$${pays.paid.toLocaleString()}`
                                                    : "—"}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <td style={sectionTitleCell}>Cambios de Datos del Beneficiario</td>
                        </tr>
                    </thead>
                    <tbody>
                        {history.length === 0 ? (
                            <tr>
                                <td style={itemCell}>
                                    <div style={itemLine}>
                                        <span style={labelStyle}>Registros</span>
                                        <span style={valueStyle}>No hay cambios registrados</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            history.map((item, idx) => (
                                <tr key={`history-${idx}`}>
                                    <td style={itemCell}>
                                        <div style={itemLine}>
                                            <span style={labelStyle}>Cambio</span>
                                            <span style={valueStyle}>
                                                {safeText(item?.description)}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={itemCell}>
                                        <div style={itemLine}>
                                            <span style={labelStyle}>Fecha</span>
                                            <span style={valueStyle}>
                                                {item?.created_at?.split("T")[0] || "—"}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={itemCell}>
                                        <span>&nbsp;</span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pie de página */}
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr>
                            <td
                                style={{
                                    textAlign: 'center',
                                    borderLeft: '1px solid black',
                                    borderRight: '1px solid black',
                                    padding: '2px',
                                }}
                            >
                                Transversal 11a Calle 11 # 25-27 Palacio Municipal - Código Postal:
                                253480
                            </td>
                        </tr>
                        <tr>
                            <td
                                style={{
                                    textAlign: 'center',
                                    borderLeft: '1px solid black',
                                    borderRight: '1px solid black',
                                    padding: '2px',
                                }}
                            >
                                alcaldia@puertosalgar-cundinamarca.gov.co
                            </td>
                        </tr>
                        <tr>
                            <td
                                style={{
                                    textAlign: 'center',
                                    borderLeft: '1px solid black',
                                    borderRight: '1px solid black',
                                    borderBottom: '1px solid black',
                                    padding: '2px',
                                }}
                            >
                                www.puertosalgar-cundinamarca.gov.co
                            </td>
                        </tr>
                    </thead>
                </table>
            </div>
        </>
    );
};
