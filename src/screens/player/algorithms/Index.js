import Ethereal from "./ethereal";

const Algorithms = ({ layer, preview }) => {
    switch (layer.algorithm) {
        case 'ethereal':
            return <Ethereal preview={preview} />
        default:
            return
    }
}

export default Algorithms;