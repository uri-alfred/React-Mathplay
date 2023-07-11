// assets
import HomeIcon from '@mui/icons-material/Home';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SsidChartIcon from '@mui/icons-material/SsidChart';
import GroupsIcon from '@mui/icons-material/Groups';

// icons
const icons = {
    SsidChartIcon,
    HomeIcon,
    PeopleAltIcon,
    GroupsIcon
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
            breadcrumbs: true
        },
        {
            id: 'estadisticas',
            title: 'Estadisticas',
            type: 'item',
            url: '/Estadisticas',
            icon: icons.SsidChartIcon,
            breadcrumbs: true
        },
        {
            id: 'grupos',
            title: 'Grupos',
            type: 'item',
            url: '/Grupos',
            icon: icons.GroupsIcon,
            breadcrumbs: true
        }
    ]
};

export default dashboard;
