// Garbo, just please make a cors params for this script, i cant fetch open notify without JSONP
var __OPENNOTIFY_SCRATCHEXT__DEFAULTCONF = {
    point: 'https://open-notify.org',
    fdatas: {
        stationloc: undefined,
        astronauts: undefined
    },
    internal: {
        fdataFallback: { message: "error" }
    }
};
Object.freeze(__OPENNOTIFY_SCRATCHEXT__DEFAULTCONF);
(function (Scratch) {
    'use strict';
    if (!Scratch.extensions.unsandboxed) {
        throw new Error('run this on unsandboxed mode and make sure you are loading it in turbowarp-based scratch');
    }
    const vm = Scratch.vm;
    const rt = vm.runtime
    let apistore = {}
    function resetapistore(){
        apistore = JSON.parse(JSON.stringify(__OPENNOTIFY_SCRATCHEXT__DEFAULTCONF))
    }
    resetapistore()
    class OpenNotifyApi {
        // constructor() {
        //     rt.on('BEFORE_EXECUTE', () => apistore = __OPENNOTIFY_SCRATCHEXT__DEFAULTCONF)
        // }
        getInfo() {
            return {
                id: 'opennotifyapiext',
                name: 'Open Notify Api',
                blocks: [
                    '--- data related ---',
                    {
                        opcode: 'setwebpoint',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Set web starting point to [SPOINT]',
                        arguments: {
                            SPOINT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: __OPENNOTIFY_SCRATCHEXT__DEFAULTCONF.point
                            }
                        }
                    },
                    {
                        opcode: 'fetchstationloc',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Fetch station location'
                    },
                    {
                        opcode: 'fetchstationlocsuccess',
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Success fetching iss' station position?"
                    },
                    {
                        opcode: 'resvar',
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Reset open notify extension's cache"
                    },
                    {
                        opcode: 'rawstationloc',
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Get raw station data"
                    },
                    {
                        opcode: 'latstationloc',
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Get latitude of iss' station position"
                    },
                ]
            };
        }
        resvar = resetapistore
        setwebpoint(args, utils) {
            apistore.point = args.SPOINT.toString()||__OPENNOTIFY_SCRATCHEXT__DEFAULTCONF.point
        }
        async fetchstationloc() {
            let fdata = apistore.internal.fdataFallback
            fdata = await fetch(`${apistore.point}/iss-now.json`)
            fdata = fdata.json()||apistore.internal.fdataFallback
        }
        fetchstationlocsuccess() {
            return apistore.fdatas.stationloc.message === "success"
        }
        rawstationloc() {
            return JSON.stringify(apistore.fdatas.stationloc || apistore.internal.fdataFallback)
        }
        latstationloc() {
            if (!this.fetchstationlocsuccess()) return ''
            return apistore.fdatas.stationloc.iss_position.latitude
        }

    }
    Scratch.extensions.register(new OpenNotifyApi());
})(Scratch);
