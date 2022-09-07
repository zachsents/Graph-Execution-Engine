import NodeTypes from "./nodes/index.js"

export function getNode(id, nodes) {
    return nodes.find(node => node.id == id)
}

export function getNodeType(nodeOrNodeId, nodes) {
    return typeof nodeOrNodeId == "string" ?
        NodeTypes[getNode(nodeOrNodeId, nodes)?.type] :
        NodeTypes[nodeOrNodeId?.type]
}

function parseHandleId(id) {
    return id.match(/\<([\w\W]*?)\>(.*)/)?.[2]
}

export function prepGraph(nodes, edges) {
    return {
        // add internal state to nodes that don't have it
        nodes: nodes
            .map(node => node.state ? node : {
                ...node,
                state: {}
            }),
        edges: edges
            // parse handle IDs
            .map(edge => ({
                ...edge,
                sourceHandle: parseHandleId(edge.sourceHandle),
                targetHandle: parseHandleId(edge.targetHandle),
            }))
    }
}

function getConnectedHandles(nodeId, handleName, nodes, edges) {
    return edges
        .filter(edge =>
            (edge.target == nodeId && edge.targetHandle == handleName) ||
            (edge.source == nodeId && edge.sourceHandle == handleName)
        )
        .map(edge =>
            edge.target == nodeId ? {
                node: getNode(edge.source, nodes),
                handle: edge.sourceHandle
            } : {
                node: getNode(edge.target, nodes),
                handle: edge.targetHandle
            }
        )
}

export function prepareValueTargets(nodeId, nodes, edges) {
    const nodeType = getNodeType(nodeId, nodes)

    // prepare each individual value target and combine into an object
    return Object.fromEntries(
        Object.keys(nodeType?.targets?.values || {}).map(valueTargetName => [
            valueTargetName,
            prepareValueTarget(nodeId, valueTargetName, nodes, edges)
        ])
    )
}

function prepareValueTarget(nodeId, handleName, nodes, edges) {
    const connectedValueSources = getConnectedHandles(nodeId, handleName, nodes, edges)

    return connectedValueSources.map(({ node: valueSourceNode, handle: valueSourceHandle }) => {
        const nodeType = getNodeType(valueSourceNode)

        // recursively prep value targets
        const valueTargets = prepareValueTargets(valueSourceNode.id, nodes, edges)

        // use getter to grab value -- we bind the node's internal state to the functions
        const getter = nodeType.sources.values[valueSourceHandle]
            .get.bind(valueSourceNode.state)(valueTargets)
        return typeof getter === "function" ? getter.bind(valueSourceNode.state)() : getter     // could be function or just a value
    })
}


export function prepareSignalSources(nodeId, nodes, edges) {
    const nodeType = getNodeType(nodeId, nodes)

    // prepare each individual signal source and combine into an object
    return Object.fromEntries(
        Object.keys(nodeType?.sources?.signals || {}).map(signalSourceName => [
            signalSourceName,
            prepareSignalSource(nodeId, signalSourceName, nodes, edges)
        ])
    )
}

function prepareSignalSource(nodeId, handleName, nodes, edges) {
    const connectedSignalTargets = getConnectedHandles(nodeId, handleName, nodes, edges)

    // find all the connected actions
    const actions = connectedSignalTargets.map(({ node: signalTargetNode, handle: signalTargetHandle }) => {
        const nodeType = getNodeType(signalTargetNode)

        // recursively prep value targets and signal sources
        const valueTargets = prepareValueTargets(signalTargetNode.id, nodes, edges)
        const signalSources = prepareSignalSources(signalTargetNode.id, nodes, edges)

        // create and return action function -- we bind the node's internal state to the functions
        return nodeType.targets.signals[signalTargetHandle]
            .action.bind(signalTargetNode.state)(valueTargets, signalSources).bind(signalTargetNode.state)
    })

    // combine into one function to fire at once
    return x => actions.forEach(action => action(x))
}