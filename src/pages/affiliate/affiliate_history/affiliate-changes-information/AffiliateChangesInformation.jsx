import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';
import { FiUser } from 'react-icons/fi';

export const AffiliateChangesInformation = ({ data }) => {
    const entryGrid = {
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
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

    if (!data || data.length === 0) {
        return (
            <Card sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}>
                <CardHeader
                    title='Información de cambios de datos del beneficiario'
                    sx={{
                        textAlign: 'center',
                        backgroundColor: '#031b32',
                        color: '#fff',
                        '& .MuiCardHeader-title': { fontWeight: 700 },
                    }}
                />
                <CardContent sx={{ px: 3, py: 4 }}>
                    <Typography variant='body2'>No hay cambios registrados.</Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}>
            <CardHeader
                title='Información de cambios de datos del beneficiario'
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
                    <Box
                        sx={{
                            width: 90,
                            height: 90,
                            borderRadius: '50%',
                            backgroundColor: '#f0f3f7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
                        }}
                    >
                        <FiUser size={44} color='#041432' />
                    </Box>
                    <Box>
                        <Typography variant='h6' fontWeight={700}>
                            Cambios del beneficiario
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                            {data.length} registro(s)
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'grid', gap: 2 }}>
                    {data.map((descriptions) => (
                        <Box key={descriptions.id} sx={entryGrid}>
                            <Box sx={infoItemSx}>
                                <Typography variant='caption' sx={{ letterSpacing: 0.6, color: 'text.secondary' }}>
                                    Cambios
                                </Typography>
                                <Typography variant='body2' fontWeight={600}>
                                    {descriptions?.description || '—'}
                                </Typography>
                            </Box>
                            <Box sx={infoItemSx}>
                                <Typography variant='caption' sx={{ letterSpacing: 0.6, color: 'text.secondary' }}>
                                    Fecha
                                </Typography>
                                <Typography variant='body2' fontWeight={600}>
                                    {descriptions?.created_at?.split('T')[0] || '—'}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
};
