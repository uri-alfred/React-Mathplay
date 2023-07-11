import { React, useState } from 'react';

// material-ui
import {
    Box,
    Button,
    Grid,
    List,
    ListItemButton,
    ListItemText,
    MenuItem,
    Stack,
    TextField,
    Typography
} from '@mui/material';

// project import
import OrdersTable from './OrdersTable';
import IncomeAreaChart from './IncomeAreaChart';
import MonthlyBarChart from './MonthlyBarChart';
import ReportAreaChart from './ReportAreaChart';
import SalesColumnChart from './SalesColumnChart';
import MainCard from '../commons/MainCard';


// sales report status
const status = [
    {
        value: 'today',
        label: 'Today'
    },
    {
        value: 'month',
        label: 'This Month'
    },
    {
        value: 'year',
        label: 'This Year'
    }
];

export default function Estadisticas() {

    const [value, setValue] = useState('today');
    const [slot, setSlot] = useState('week');

    return (
        <div>
            <br />
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <div className='titulos'>
                        <h1>Estadisticas</h1>
                    </div> <br />
                </Grid>
                <Grid item xs={0}></Grid>
                <Grid item xs={12}>

                    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
                        {/* row 1 */}
                        <Grid item xs={12} sx={{ mb: -2.25 }}>
                            <Typography variant="h4">15 Puzzle</Typography>
                        </Grid>

                        <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

                        {/* row 2 */}
                        <Grid item xs={12} md={7} lg={8}>
                                <MainCard content={false} sx={{ mt: 1.5 }}>
                            <br />
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Typography variant="h5"> Mis mejores/peores 5 jugadas</Typography>
                                </Grid>
                                <Grid item>
                                    <Stack direction="row" alignItems="center" spacing={0}>
                                        <Button
                                            size="small"
                                            onClick={() => setSlot('month')}
                                            color={slot === 'month' ? 'primary' : 'secondary'}
                                            variant={slot === 'month' ? 'outlined' : 'text'}
                                        >
                                            Movimientos
                                        </Button>
                                        <Button
                                            size="small"
                                            onClick={() => setSlot('week')}
                                            color={slot === 'week' ? 'primary' : 'secondary'}
                                            variant={slot === 'week' ? 'outlined' : 'text'}
                                        >
                                            Tiempo
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                                <Box sx={{ pt: 1, pr: 2 }}>
                                    <IncomeAreaChart slot={slot} />
                                </Box>
                            </MainCard>
                        </Grid>
                        

                        {/* row 3 */}
                        {/* <Grid item xs={12} md={7} lg={8}>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Typography variant="h5">Recent Orders</Typography>
                                </Grid>
                                <Grid item />
                            </Grid>
                            <MainCard sx={{ mt: 2 }} content={false}>
                                <OrdersTable />
                            </MainCard>
                        </Grid> */}
                        {/* <Grid item xs={12} md={5} lg={4}>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Typography variant="h5">Analytics Report</Typography>
                                </Grid>
                                <Grid item />
                            </Grid>
                            <MainCard sx={{ mt: 2 }} content={false}>
                                <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 2 } }}>
                                    <ListItemButton divider>
                                        <ListItemText primary="Company Finance Growth" />
                                        <Typography variant="h5">+45.14%</Typography>
                                    </ListItemButton>
                                    <ListItemButton divider>
                                        <ListItemText primary="Company Expenses Ratio" />
                                        <Typography variant="h5">0.58%</Typography>
                                    </ListItemButton>
                                    <ListItemButton>
                                        <ListItemText primary="Business Risk Cases" />
                                        <Typography variant="h5">Low</Typography>
                                    </ListItemButton>
                                </List>
                                <ReportAreaChart />
                            </MainCard>
                        </Grid> */}

                        {/* row 4 */}
                        {/* <Grid item xs={12} md={7} lg={8}>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Typography variant="h5">Sales Report</Typography>
                                </Grid>
                                <Grid item>
                                    <TextField
                                        id="standard-select-currency"
                                        size="small"
                                        select
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                        sx={{ '& .MuiInputBase-input': { py: 0.5, fontSize: '0.875rem' } }}
                                    >
                                        {status.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                            <MainCard sx={{ mt: 1.75 }}>
                                <Stack spacing={1.5} sx={{ mb: -12 }}>
                                    <Typography variant="h6" color="secondary">
                                        Net Profit
                                    </Typography>
                                    <Typography variant="h4">$1560</Typography>
                                </Stack>
                                <SalesColumnChart />
                            </MainCard>
                        </Grid> */}

                    </Grid>

                </Grid>
                <Grid item xs={0}></Grid>
            </Grid>
        </div>

    );

}
