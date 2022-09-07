import MathNodes from "./math.js"
import TimingNodes from "./timing.js"
import PrimitiveNodes from "./primitive.js"
import UtilNodes from "./util.js"
import DebugNodes from "./debug.js"
import MiscNodes from "./misc.js"

export default {
    ...MathNodes,
    ...TimingNodes,
    ...PrimitiveNodes,
    ...UtilNodes,
    ...DebugNodes,
    ...MiscNodes,
}