import { StyleSheet } from 'react-native';
import theme from '../../styles/theme'

const styles = StyleSheet.create({
    iconContainer: {
        width: 20,
        height: 20
    },
    icon: {
        stroke: theme.iconFill,
        strokeLinecap: "round",
        strokeWidth: "1"
    },
    
})

export default styles