/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 30/09/15
 * Time: 3:55 PM
 * To change this template use File | Settings | File Templates.
 */
(function () {

    "use strict";

    function dataManagerTests(software, mockObject) {

        describe("A test suite for the data manager in " + software, function () {

            var module = unitTests.modules["generalDataManager_" + software];
            var globalDataTypes = unitTests.getModule("globalSlideObjectTypes");

            beforeEach(function () {

                window._extra = mockObject;
                globalDataTypes();
                _extra.dataTypes.convertSlideObjectType = function (type) {
                    return type;
                };
                this.onLoadCallback = module();

            });

            afterEach(function () {
                delete window._extra;
            });

            it("should define the dataManager object", function () {
                expect(_extra.dataManager).toBeDefined();
            });

            it("should define a getSlideObjectDataByName method which returns a formatted data object", function () {
                expect(_extra.dataManager.getSlideObjectDataByName).toBeDefined();
                var result = _extra.dataManager.getSlideObjectDataByName("foobar");
                expect(result.name).toEqual("foobar");
            });

            it("should allow us to send it a slide object name and it will return its data type", function () {

                expect(_extra.dataManager.getSlideObjectTypeByName("foobar")).toBe(612);

            });

            it("should return the same data object if we request the same object", function () {

                var data1 = _extra.dataManager.getSlideObjectDataByName("foobar"),
                    data2 = _extra.dataManager.getSlideObjectDataByName("foobar");

                expect(data1).toBe(data2);

            });

            it("should be able to create a new slide object data", function () {

                var result = _extra.dataManager.createSlideObjectData("foobar");
                expect(result.name).toEqual("foobar");

            });

            it("should be able to create a new slide object data even if it receives container data first", function () {

                var result = _extra.dataManager.createSlideObjectData("foobarc");
                expect(result.name).toEqual("foobar");

            });

            it("should be able to detect the difference between container and non-container objects", function () {

                var name = "foobarc",
                    data = mockObject.allSlideObjects[name],
                    result = _extra.dataManager.isContainerData(name, data);

                expect(result).toEqual(true);

            });

            it("should successfully remove the 'c' or 'sha' suffix from a string", function () {

                var name = "foobarc",
                    result = _extra.dataManager.removeContainerSuffix(name);

                expect(result).toEqual("foobar");

            });

        });

    }

    var allSlideObjectData = {
        "foobar": {
            "JSONTT_4":[],
            JSONTT_5:[],
            amc:true,
            apsn:"Slide11166",
            bstiid:-1,
            chfn:null, // Usually a function
            cpa:true,
            dclk:false,
            eh:null, // Usually a fuction
            enabled:1,
            from:91,
            iflbx:false,
            immo:false,
            ipflbx:true,
            isDD:false,
            ma:-1,
            mdi:"map01Btnc",
            oca:"javascript",
            ofa:"cpCmndResume = 1;",
            ofc:"",
            ofct:0,
            osc:"",
            osct:0,
            pa:-1,
            pfc:1,
            retainState: false,
            rp:0,
            rpa:0,
            sat:true,
            sicbs:false,
            sihds: false,
            sihhs:true,
            sipst:0,
            siq:false,
            stc:["map01Btn", "si75411"],
            stis:0,
            stl:[],
            to:180,
            trin:0,
            trout: 0,
            type: 612,
            uab:1
        },
        "foobarc": {
            JSONEffectData:false,
            accstr:" ",
            b:[861, 206, 894, 260],
            dn:"map02Btn",
            effectiveVi:1,
            fa:0,
            gf :{},
            p0:[],
            sc:"#533312",
            ss :0,
            svg:false,
            sw:0,
            ti:2500,
            traccstr:"",
            uid:16576,
            vb:[861, 206, 894, 260],
            vbwr:[861, 206, 894, 260],
            visible:1
        }
    };


    dataManagerTests(unitTests.CAPTIVATE, {
        "allSlideObjects": allSlideObjectData,
        "captivate": {
            "model": {
                "data": allSlideObjectData
            },
            "allSlideObjectsData": allSlideObjectData
        },
        "factories":{
            "createSlideObjectData":function (name,data,type) {
                return {
                    "name":name,
                    "data":data,
                    "type":type
                };
            }
        },
        "log": function () {

        },
        "classes":unitTests.classes
    });
    //dataManagerTests(unitTests.STORYLINE, unitTests.getStorylineMockObject());

}());