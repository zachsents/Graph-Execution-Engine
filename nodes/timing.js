
export default {
    Interval: {
        id: "Interval",
        name: "Timer",
        description: "Generates a signal once every specified time period.",
        categories: ["Timing"],
        targets: {
            values: {
                period: {}
            }
        },
        sources: {
            signals: {
                " ": {}
            }
        },
        setup(valueTargets, signalSources) {
            const period = valueTargets.period()[0]
            period > 10 && setInterval(() => {
                signalSources[" "]?.()
            }, period)
        }
    },
    Delay: {
        id: "Delay",
        name: "Delay",
        description: "",
        categories: ["Timing"],
        targets: {
            values: {
                time: {}
            },
            signals: {
                start: {
                    action: (valueTargets, signalSources) =>
                        x => setTimeout(() => signalSources[" "]?.(x), valueTargets.time()[0])
                }
            }
        },
        sources: {
            signals: {
                " ": {}
            }
        }
    }
}