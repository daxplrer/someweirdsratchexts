var __OPENNOTIFY_SCRATCHEXT__DEFAULTCONF = {
    point: 'http://open-notify.org',
    fdatas:{
        stationloc:undefined,
        astronauts:undefined
    }
}
Object.freeze(__OPENNOTIFY_SCRATCHEXT__DEFAULTCONF);
(function (Scratch) {
    'use strict';
    const vm = Scratch.vm;
    const rt = vm.runtime
    let apistore = __OPENNOTIFY_SCRATCHEXT__DEFAULTCONF
    if (!Scratch.extensions.unsandboxed) {
        throw new Error('run this on unsandboxed mode and make sure you are loading it in turbowarp-based scratch');
    }
    

    class AstronautsApi {
        constructor(){
            rt.on('BEFORE_EXECUTE', ()=>apistore = __OPENNOTIFY_SCRATCHEXT__DEFAULTCONF)
        }
        getInfo() {
            return {
                id: 'opennotifyapi',
                name: 'Open Notify Astronauts Api',
                blocks: [
                    {
                        opcode: 'fetchstationloc',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Fetch station location'
                    },
                    {
                        opcode: 'setwebpoint',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Set web starting point to',
                        arguments: {
                            SPOINT: {
                              type: Scratch.ArgumentType.STRING,
                              menu: 'Starting point'
                            }
                        }
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
                ]
            };
        }
        resvar(){
            apistore = __OPENNOTIFY_SCRATCHEXT__DEFAULTCONF
        }
        setwebpoint(args, utils){
            apistore.point = args.SPOINT.toString()
        }
        fetchstationloc() {
            let fdata = {success:false}
            try {
          if (Scratch.canFetch(`${apistore.point}/iss-now.json`)) fetch(`${apistore.point}/iss-now.json`).then((res)=>fdata = res.json())
            } finally{}
          apistore.fdatas.stationloc = fdata
        }
        rawstationloc(){
            return apistore.fdatas.stationloc||{success:false}
        }
        
    } 
    Scratch.extensions.register(new AstronautsApi());
})
