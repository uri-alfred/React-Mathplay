// assets
import AddCommentIcon from '@mui/icons-material/AddComment';

// icons
const icons = {
    AddCommentIcon
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const support = {
    id: 'support',
    title: 'Soporte',
    type: 'group',
    children: [
        {
            id: 'comentarios',
            title: 'Comentarios',
            type: 'item',
            url: '/sample-page',
            icon: icons.AddCommentIcon
        }
    ]
};

export default support;
