// assets
import HomeIcon from '@mui/icons-material/Home';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SsidChartIcon from '@mui/icons-material/SsidChart';

// icons
const icons = {
    SsidChartIcon,
    HomeIcon,
    PeopleAltIcon
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
    id: 'group-inicio',
    title: 'Inicio',
    type: 'group',
    children: [
        {
            id: 'principal',
            title: 'Principal',
            type: 'item',
            url: '/',
            icon: icons.HomeIcon,
            breadcrumbs: false
        },
        {
            id: 'usuarios',
            title: 'Usuarios',
            type: 'item',
            url: '/Usuarios',
            icon: icons.PeopleAltIcon,
            breadcrumbs: false
        },
        {
            id: 'estadisticas',
            title: 'Estadisticas',
            type: 'item',
            url: '/Estadisticas',
            icon: icons.SsidChartIcon,
            breadcrumbs: false
        }
    ]
};

export default dashboard;
