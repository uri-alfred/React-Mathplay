// assets
import ExtensionIcon from '@mui/icons-material/Extension';
import Filter9Icon from '@mui/icons-material/Filter9';

// icons
const icons = {
    ExtensionIcon,
    Filter9Icon
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
    id: 'juegos',
    title: 'Juegos',
    type: 'group',
    children: [
        {
            id: 'puzzle',
            title: '15 Puzzle',
            type: 'item',
            url: '/puzzle',
            icon: icons.ExtensionIcon
        },
        {
            id: 'sudoku',
            title: 'Sudoku',
            type: 'item',
            url: '/sudoku',
            icon: icons.Filter9Icon
        }
    ]
};

export default utilities;
