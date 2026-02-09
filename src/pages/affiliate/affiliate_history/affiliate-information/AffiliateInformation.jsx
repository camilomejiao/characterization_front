import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';

export const AffiliateInformation = ({ data }) => {
    const detailsGrid = {
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' },
        gap: 2,
    };
    const items = [
        { label: 'Régimen', value: data?.regime?.name },
        { label: 'Estado de afiliación', value: data?.affiliatedState?.description },
        { label: 'Tipo de población', value: data?.populationType?.name },
        { label: 'EPS', value: data?.eps?.name },
        { label: 'IPS Primaria', value: data?.ipsPrimary?.name || 'No registra' },
        { label: 'IPS Odontológica', value: data?.ipsDental?.name || 'No registra' },
        { label: 'Tipo de afiliado', value: data?.affiliateType?.name || 'No registra' },
        { label: 'Metodología', value: data?.methodology?.name },
        { label: 'Grupo y Subgrupo', value: data?.groupSubgroup?.subgroup },
        { label: 'Nivel', value: data?.level?.name ?? 'NO REGISTRA' },
        { label: 'Clase de afiliación', value: data?.membershipClass?.name },
        { label: 'Estado de afiliación', value: data?.affiliateType?.name },
        { label: 'Número del formulario', value: data?.formNumber },
        { label: 'Etnia', value: data?.ethnicity?.name },
        { label: 'Fecha de afiliación', value: data?.dateOfAffiliated },
        { label: 'Número de ficha Sisben', value: data?.sisbenNumber },
        { label: 'Observaciones', value: data?.observations },
    ];

    return (
        <Card sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}>
            <CardHeader
                title='Información de Afiliación'
                sx={{
                    textAlign: 'center',
                    backgroundColor: '#031b32',
                    color: '#fff',
                    '& .MuiCardHeader-title': { fontWeight: 700 },
                }}
            />
            <CardContent sx={{ px: 3, py: 4 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mb: 3,
                        justifyContent: { xs: 'center', md: 'flex-start' },
                    }}
                >
                    <Box>
                        <Typography variant='h6' fontWeight={700}>
                            Detalle de afiliación
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                            {data?.regime?.name || 'Régimen'} • {data?.affiliatedState?.description || 'Estado'}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={detailsGrid}>
                    {items.map((item) => (
                        <Box
                            key={item.label}
                            sx={{
                                p: 1.25,
                                borderRadius: 2,
                                backgroundColor: 'rgba(15,55,90,0.04)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 2,
                            }}
                        >
                            <Typography variant='caption' sx={{ letterSpacing: 0.6, color: 'text.secondary' }}>
                                {item.label}
                            </Typography>
                            <Typography variant='body2' fontWeight={600}>
                                {item.value || '—'}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
};
