import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';

export const LMAInformation = ({ data }) => {
    const entryGrid = {
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' },
        gap: 2,
    };

    const infoItemSx = {
        p: 1.25,
        borderRadius: 2,
        backgroundColor: 'rgba(15,55,90,0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
    };

    return (
        <Card sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}>
            <CardHeader
                title='Información de pagos realizados'
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
                            Historial de pagos
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                            {data?.length ?? 0} pago(s)
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'grid', gap: 2 }}>
                    {data?.map((pays) => (
                        <Box key={pays.id} sx={entryGrid}>
                            <Box sx={infoItemSx}>
                                <Typography variant='caption' sx={{ letterSpacing: 0.6, color: 'text.secondary' }}>
                                    Mes
                                </Typography>
                                <Typography variant='body2' fontWeight={600}>
                                    {pays.month || '-'}
                                </Typography>
                            </Box>
                            <Box sx={infoItemSx}>
                                <Typography variant='caption' sx={{ letterSpacing: 0.6, color: 'text.secondary' }}>
                                    Año
                                </Typography>
                                <Typography variant='body2' fontWeight={600}>
                                    {pays.year || '-'}
                                </Typography>
                            </Box>
                            <Box sx={infoItemSx}>
                                <Typography variant='caption' sx={{ letterSpacing: 0.6, color: 'text.secondary' }}>
                                    Valor pagado
                                </Typography>
                                <Typography variant='body2' fontWeight={600}>
                                    {pays.paid != null ? `$${pays.paid.toLocaleString()}` : '—'}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
};
