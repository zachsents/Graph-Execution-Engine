import fs from "fs/promises"
import { getNodeType, prepGraph, prepareSignalSources, prepareValueTargets } from "./util.js"
import NodeTypes from "./nodes/index.js"

function trySettingUpNode(node, nodes, edges) {

    const nodeType = getNodeType(node)

    // see if setup function exists
    if (!nodeType?.setup)
        return

    console.debug(`Setting up node: ${node.id} (${node.type})`)

    // prep values needed for setup
    const valueTargets = prepareValueTargets(node.id, nodes, edges)
    const signalSources = prepareSignalSources(node.id, nodes, edges)

    // bind internal state to setup function then go!
    nodeType.setup.bind(node.state)(valueTargets, signalSources)
}

export async function runFlowFile(graphFile) {
    // load from file
    const { nodes, edges } = JSON.parse(
        await fs.readFile(graphFile, "utf-8")
    )

    // run
    runFlow(nodes, edges)
}

export function runFlow(rawNodes, rawEdges) {
    // prep the graph for execution
    const { nodes, edges } = prepGraph(rawNodes, rawEdges)

    // setup nodes
    nodes.forEach(node => trySettingUpNode(node, nodes, edges))
}


export { NodeTypes }