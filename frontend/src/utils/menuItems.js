import {home, mental, medical, faMap} from './Icons'
export const menuItems = [
    {
        id: 1,
        title: 'Home',
        icon: home,
        link: '/dashboard',
    },
    {
        id: 2,
        title: "Predict Disease",
        icon: medical,
        link: "/SymptomAnalysis",
    },
    {   
        id: 3,
        title: "Mind-Bot",
        icon: mental,
        link: '/MentalWellness',
    },
    {
        id: 4,
        title: "Track Diseases",
        icon: faMap,
        link: '/ConsultDoctor',
    }
]