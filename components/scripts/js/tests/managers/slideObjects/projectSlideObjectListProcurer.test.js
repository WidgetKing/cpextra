/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 24/03/16
 * Time: 4:53 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for _extra.slideObjects project slide object list", function () {

    "use strict";

    var module = unitTests.getModule("projectSlideObjectListProcurer", unitTests.CAPTIVATE);

    beforeEach(function () {
        var cp = {
            "fd":null
        };

        window._extra = {
            "classes":unitTests.classes,
            "slideObjects":{
                projectSlideObjectNames:{}
            },
            "w":{
               "isNaN":isNaN
            },
            "captivate":{
                "allSlideObjectsData": {
                        pref: {
                            acc: 1,
                            rkt: 0,
                            hsr: 1
                        },
                        Slide5238: {
                            lb: '',
                            id: 5238,
                            from: 1,
                            to: 30,
                            useng: true,
                            transition: {
                                type: 0
                            },
                            mmot: false,
                            mdi: 'Slide5238c',
                            st: 'Normal Slide',
                            audCC: [],
                            vidCC: [],
                            accstr: ' ',
                            si: [],
                            iph: [],
                            v: false,
                            bc: '#ffffff',
                            JSONTT_0: [],
                            JSONTT_6: [],
                            qs: ''
                        },
                        Slide5238c: {
                            b: [0, 0, 0, 0],
                            css: {
                                414: {
                                    l: '0px',
                                    t: '0px',
                                    w: '100%',
                                    h: '466px',
                                    p: 'absolute',
                                    ipiv: 1,
                                    cah: false,
                                    cav: false
                                },
                                768: {
                                    l: '0px',
                                    t: '0px',
                                    w: '100%',
                                    h: '627px',
                                    p: 'absolute',
                                    ipiv: 1,
                                    cah: false,
                                    cav: false
                                },
                                1024: {
                                    l: '0px',
                                    t: '0px',
                                    w: '100%',
                                    h: '627px',
                                    p: 'absolute',
                                    ipiv: 1,
                                    cah: false,
                                    cav: false
                                }
                            },
                            sr: cp.fd,
                            dn: 'Slide5238',
                            visible: '1'
                        },
                        Widget_1: {
                            type: 133,
                            from: 31,
                            to: 60,
                            rp: 0,
                            rpa: 0,
                            mdi: 'Widget_1c',
                            immo: false,
                            apsn: 'Slide5259',
                            trin: 0,
                            trout: 0
                        },
                        Widget_1c: {
                            b: [437, 288, 587, 338],
                            uid: 5247,
                            css: {
                                414: {
                                    l: '42.676%',
                                    t: '45.933%',
                                    b: 'auto',
                                    r: 'auto',
                                    lhEID: 0,
                                    lhV: '42.676%',
                                    lhID: -1,
                                    lvEID: 0,
                                    lvV: '45.933%',
                                    lvID: -1,
                                    w: '14.648%',
                                    h: 'auto',
                                    apr: '3.000',
                                    cah: false,
                                    cav: false,
                                    rpmm: {
                                        mw: '4px',
                                        mh: '4px',
                                        Mw: '',
                                        Mh: ''
                                    },
                                    p: 'absolute',
                                    ipiv: 1
                                },
                                768: {
                                    l: '42.676%',
                                    t: '45.933%',
                                    b: 'auto',
                                    r: 'auto',
                                    lhEID: 0,
                                    lhV: '42.676%',
                                    lhID: -1,
                                    lvEID: 0,
                                    lvV: '45.933%',
                                    lvID: -1,
                                    w: '14.648%',
                                    h: 'auto',
                                    apr: '3.000',
                                    cah: false,
                                    cav: false,
                                    rpmm: {
                                        mw: '4px',
                                        mh: '4px',
                                        Mw: '',
                                        Mh: ''
                                    },
                                    p: 'absolute',
                                    ipiv: 1
                                },
                                1024: {
                                    l: '42.676%',
                                    t: '45.933%',
                                    b: 'auto',
                                    r: 'auto',
                                    lhEID: 0,
                                    lhV: '42.676%',
                                    lhID: -1,
                                    lvEID: 0,
                                    lvV: '45.933%',
                                    lvID: -1,
                                    w: '14.648%',
                                    h: 'auto',
                                    apr: '3.000',
                                    cah: false,
                                    cav: false,
                                    rpmm: {
                                        mw: '4px',
                                        mh: '4px',
                                        Mw: '',
                                        Mh: ''
                                    },
                                    p: 'absolute',
                                    ipiv: 1
                                }
                            },
                            dn: 'Widget_1',
                            visible: 1,
                            effectiveVi: 1,
                            JSONEffectData: false,
                            accstr: ' ',
                            traccstr: '',
                            ti: 2500,
                            wp: '<object><property id="widgetfactory_captivateVersion"><string>9</string></property><property id="widgetfactory_setBefore"><true/></property><property id="widgetfactory_canAccessLibrary"><true/></property></object>',
                            iiw: false,
                            iqw: false,
                            id: 5247,
                            wc: 'CaptivateExtraWidgetInit',
                            wu: 'wr/w_5247/Widget_5247.htm',
                            sn: 'Slide5259',
                            a: 1,
                            vbwr: [437, 288, 587, 338],
                            vb: [437, 288, 587, 338]
                        },
                        Slide5259: {
                            lb: '',
                            id: 5259,
                            from: 31,
                            to: 60,
                            useng: true,
                            transition: {
                                type: 0
                            },
                            mmot: false,
                            mdi: 'Slide5259c',
                            st: 'Normal Slide',
                            audCC: [],
                            vidCC: [],
                            accstr: ' ',
                            si: [{
                                n: 'Widget_1',
                                t: 133
                            }],
                            iph: [],
                            v: false,
                            bc: '#ffffff',
                            JSONTT_0: [],
                            JSONTT_6: [],
                            qs: ''
                        },
                        Slide5259c: {
                            b: [0, 0, 0, 0],
                            css: {
                                414: {
                                    l: '0px',
                                    t: '0px',
                                    w: '100%',
                                    h: '466px',
                                    p: 'absolute',
                                    ipiv: 1,
                                    cah: false,
                                    cav: false
                                },
                                768: {
                                    l: '0px',
                                    t: '0px',
                                    w: '100%',
                                    h: '627px',
                                    p: 'absolute',
                                    ipiv: 1,
                                    cah: false,
                                    cav: false
                                },
                                1024: {
                                    l: '0px',
                                    t: '0px',
                                    w: '100%',
                                    h: '627px',
                                    p: 'absolute',
                                    ipiv: 1,
                                    cah: false,
                                    cav: false
                                }
                            },
                            sr: cp.fd,
                            dn: 'Slide5259',
                            visible: '1'
                        },
                        si1702: {
                            type: 612,
                            from: 0,
                            to: 150,
                            rp: 0,
                            rpa: 0,
                            mdi: 'si1702c',
                            immo: true,
                            apsn: 'Slide5182',
                            JSONTT_4: [],
                            cpa: true,
                            oca: 'cp.jumpToNextSlide();',
                            JSONTT_5: [],
                            ofa: 'cpCmndResume = 1;',
                            vt: '<div><span class="cp-actualText" style="line-height:100%;color:#4c4c4c;font-size:20px;font-family:\'Trebuchet MS\';"><br></span><ol></ol></div>',
                            rplm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rprm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rptm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rpbm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rpta: {
                                414: 2,
                                768: 2,
                                1024: 2
                            },
                            rptl: {
                                414: 1,
                                768: 1,
                                1024: 1
                            },
                            rpvt: {
                                414: {
                                    vt: '<div><span class="cp-actualText" style="line-height:100%;color:#4c4c4c;font-size:14px;font-family:\'Trebuchet MS\';"><br></span><ol></ol></div>',
                                    text: ''
                                },
                                768: {
                                    vt: '<div><span class="cp-actualText" style="line-height:100%;color:#4c4c4c;font-size:18px;font-family:\'Trebuchet MS\';"><br></span><ol></ol></div>',
                                    text: ''
                                },
                                1024: {
                                    vt: '<div><span class="cp-actualText" style="line-height:100%;color:#4c4c4c;font-size:20px;font-family:\'Trebuchet MS\';"><br></span><ol></ol></div>',
                                    text: ''
                                }
                            },
                            trin: 0,
                            trout: 0,
                            stl: [{
                                stn: 'Normal',
                                stt: 0,
                                stsi: [1702]
                            }],
                            stis: 0,
                            bstiid: -1,
                            sipst: 0,
                            sicbs: false,
                            sihhs: false,
                            sihds: false
                        },
                        si1702c: {
                            b: [0, 607, 1024, 627],
                            uid: 1702,
                            css: {
                                414: {
                                    l: '0.000%',
                                    t: 'auto',
                                    b: '0.000%',
                                    r: 'auto',
                                    lhEID: 0,
                                    lhV: '0.000%',
                                    lhID: -1,
                                    lvEID: 0,
                                    lvV: '0.000%',
                                    lvID: -1,
                                    w: '100.000%',
                                    h: '3.415%',
                                    cah: true,
                                    cav: false,
                                    rpmm: {
                                        mw: '4px',
                                        mh: '4px',
                                        Mw: '',
                                        Mh: ''
                                    },
                                    p: 'absolute',
                                    ipiv: 1,
                                    sh: '466'
                                },
                                768: {
                                    l: '0.130%',
                                    t: 'auto',
                                    b: '0.000%',
                                    r: 'auto',
                                    lhEID: 0,
                                    lhV: '0.130%',
                                    lhID: -1,
                                    lvEID: 0,
                                    lvV: '0.000%',
                                    lvID: -1,
                                    w: '100.000%',
                                    h: '3.386%',
                                    cah: false,
                                    cav: false,
                                    rpmm: {
                                        mw: '4px',
                                        mh: '4px',
                                        Mw: '',
                                        Mh: ''
                                    },
                                    p: 'absolute',
                                    ipiv: 1,
                                    sh: '627'
                                },
                                1024: {
                                    l: '0.000%',
                                    t: 'auto',
                                    b: '0.000%',
                                    r: 'auto',
                                    lhEID: 0,
                                    lhV: '0.000%',
                                    lhID: -1,
                                    lvEID: 0,
                                    lvV: '0.000%',
                                    lvID: -1,
                                    w: '100.000%',
                                    h: '3.190%',
                                    cah: true,
                                    cav: false,
                                    rpmm: {
                                        mw: '4px',
                                        mh: '4px',
                                        Mw: '',
                                        Mh: ''
                                    },
                                    p: 'absolute',
                                    ipiv: 1,
                                    sh: '627'
                                }
                            },
                            dn: 'si1702',
                            visible: 1,
                            effectiveVi: 1,
                            JSONEffectData: false,
                            accstr: ' ',
                            traccstr: '',
                            ti: -1,
                            sc: '#ffffff',
                            sw: 0,
                            ss: 0,
                            fa: 100,
                            bc: '#ffffff',
                            tb: {
                                414: {
                                    l: '0.00%',
                                    t: '0.00%',
                                    w: '100.00%',
                                    h: '100.00%'
                                },
                                768: {
                                    l: '0.00%',
                                    t: '0.00%',
                                    w: '100.00%',
                                    h: '100.00%'
                                },
                                1024: {
                                    l: '0.00%',
                                    t: '0.00%',
                                    w: '100.00%',
                                    h: '100.00%'
                                }
                            },
                            p0: [
                                [0],
                                [1, 0, 0],
                                [2, 0, 20.00],
                                [2, 1024, 20.00],
                                [2, 1024, 0],
                                [2, 0, 0],
                                [4]
                            ],
                            svg: false,
                            vbwr: [0, 607, 1024, 627],
                            vb: [0, 607, 1024, 627]
                        },
                        si5210: {
                            type: 612,
                            from: 61,
                            to: 150,
                            rp: 0,
                            rpa: 0,
                            mdi: 'si5210c',
                            immo: false,
                            apsn: 'Slide5182',
                            JSONTT_4: [],
                            cpa: true,
                            oca: 'cp.jumpToNextSlide();',
                            JSONTT_5: [],
                            ofa: 'cpCmndResume = 1;',
                            vt: '<div><span class="cp-actualText" style="line-height:100%;color:#4c4c4c;font-size:20px;font-family:\'Trebuchet MS\';"><br></span><ol></ol></div>',
                            rplm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rprm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rptm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rpbm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rpta: {
                                414: 2,
                                768: 2,
                                1024: 2
                            },
                            rptl: {
                                414: 1,
                                768: 1,
                                1024: 1
                            },
                            rpvt: {
                                414: {
                                    vt: '<div><span class="cp-actualText" style="line-height:100%;color:#4c4c4c;font-size:14px;font-family:\'Trebuchet MS\';"><br></span><ol></ol></div>',
                                    text: ''
                                },
                                768: {
                                    vt: '<div><span class="cp-actualText" style="line-height:100%;color:#4c4c4c;font-size:18px;font-family:\'Trebuchet MS\';"><br></span><ol></ol></div>',
                                    text: ''
                                },
                                1024: {
                                    vt: '<div><span class="cp-actualText" style="line-height:100%;color:#4c4c4c;font-size:20px;font-family:\'Trebuchet MS\';"><br></span><ol></ol></div>',
                                    text: ''
                                }
                            },
                            trin: 0,
                            trout: 0,
                            stl: [{
                                stn: 'Normal',
                                stt: 0,
                                stsi: [5210]
                            }],
                            stis: 0,
                            bstiid: -1,
                            sipst: 0,
                            sicbs: false,
                            sihhs: false,
                            sihds: false
                        },
                        si5210c: {
                            b: [0, 607, 1024, 627],
                            uid: 5210,
                            css: {
                                414: {
                                    l: '0.000%',
                                    t: 'auto',
                                    b: '0.000%',
                                    r: 'auto',
                                    lhEID: 0,
                                    lhV: '0.000%',
                                    lhID: -1,
                                    lvEID: 0,
                                    lvV: '0.000%',
                                    lvID: -1,
                                    w: '100.000%',
                                    h: '3.386%',
                                    cah: true,
                                    cav: false,
                                    rpmm: {
                                        mw: '4px',
                                        mh: '4px',
                                        Mw: '',
                                        Mh: ''
                                    },
                                    p: 'absolute',
                                    ipiv: 1
                                },
                                768: {
                                    l: '0.130%',
                                    t: 'auto',
                                    b: '0.000%',
                                    r: 'auto',
                                    lhEID: 0,
                                    lhV: '0.130%',
                                    lhID: -1,
                                    lvEID: 0,
                                    lvV: '0.000%',
                                    lvID: -1,
                                    w: '100.000%',
                                    h: '3.386%',
                                    cah: false,
                                    cav: false,
                                    rpmm: {
                                        mw: '4px',
                                        mh: '4px',
                                        Mw: '',
                                        Mh: ''
                                    },
                                    p: 'absolute',
                                    ipiv: 1
                                },
                                1024: {
                                    l: '0.000%',
                                    t: 'auto',
                                    b: '0.000%',
                                    r: 'auto',
                                    lhEID: 0,
                                    lhV: '0.000%',
                                    lhID: -1,
                                    lvEID: 0,
                                    lvV: '0.000%',
                                    lvID: -1,
                                    w: '100.000%',
                                    h: '3.190%',
                                    cah: true,
                                    cav: false,
                                    rpmm: {
                                        mw: '4px',
                                        mh: '4px',
                                        Mw: '',
                                        Mh: ''
                                    },
                                    p: 'absolute',
                                    ipiv: 1
                                }
                            },
                            dn: 'si5210',
                            visible: 1,
                            effectiveVi: 1,
                            JSONEffectData: false,
                            accstr: ' ',
                            traccstr: '',
                            ti: -1,
                            sc: '#ffffff',
                            sw: 0,
                            ss: 0,
                            fa: 100,
                            bc: '#282828',
                            tb: {
                                414: {
                                    l: '0.00%',
                                    t: '0.00%',
                                    w: '100.00%',
                                    h: '100.00%'
                                },
                                768: {
                                    l: '0.00%',
                                    t: '0.00%',
                                    w: '100.00%',
                                    h: '100.00%'
                                },
                                1024: {
                                    l: '0.00%',
                                    t: '0.00%',
                                    w: '100.00%',
                                    h: '100.00%'
                                }
                            },
                            p0: [
                                [0],
                                [1, 0, 0],
                                [2, 0, 20.00],
                                [2, 1024, 20.00],
                                [2, 1024, 0],
                                [2, 0, 0],
                                [4]
                            ],
                            svg: false,
                            vbwr: [0, 607, 1024, 627],
                            vb: [0, 607, 1024, 627]
                        },
                        SmartShape_1: {
                            type: 612,
                            from: 61,
                            to: 150,
                            rp: 0,
                            rpa: 0,
                            mdi: 'SmartShape_1c',
                            immo: false,
                            apsn: 'Slide5182',
                            JSONTT_4: [],
                            cpa: true,
                            oca: 'cp.jumpToNextSlide();',
                            JSONTT_5: [],
                            ofa: 'cpCmndResume = 1;',
                            vt: '<div><div style="margin-left:0px;display:block;text-align:center;"><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:20px;font-family:\'Trebuchet MS\';"><span style="">Normal</span></span><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:20px;font-family:\'Trebuchet MS\';"><br></span></div></div>',
                            rplm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rprm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rptm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rpbm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rpta: {
                                414: 2,
                                768: 2,
                                1024: 2
                            },
                            rptl: {
                                414: 1,
                                768: 1,
                                1024: 1
                            },
                            rpvt: {
                                414: {
                                    vt: '<div><div style="margin-left:0px;display:block;text-align:center;"><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:14px;font-family:\'Trebuchet MS\';"><span style="">Normal</span></span><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:14px;font-family:\'Trebuchet MS\';"><br></span></div></div>',
                                    text: 'Normal'
                                },
                                768: {
                                    vt: '<div><div style="margin-left:0px;display:block;text-align:center;"><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:18px;font-family:\'Trebuchet MS\';"><span style="">Normal</span></span><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:18px;font-family:\'Trebuchet MS\';"><br></span></div></div>',
                                    text: 'Normal'
                                },
                                1024: {
                                    vt: '<div><div style="margin-left:0px;display:block;text-align:center;"><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:20px;font-family:\'Trebuchet MS\';"><span style="">Normal</span></span><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:20px;font-family:\'Trebuchet MS\';"><br></span></div></div>',
                                    text: 'Normal'
                                }
                            },
                            trin: 0,
                            trout: 0,
                            stl: [{
                                stn: 'Normal',
                                stt: 0,
                                stsi: [5271]
                            }, {
                                stn: 'X_ROLLOVER',
                                stt: 9,
                                stsi: [5351]
                            }],
                            stis: 0,
                            bstiid: -1,
                            sipst: 0,
                            sicbs: false,
                            sihhs: false,
                            sihds: false
                        },
                        SmartShape_1c: {
                            b: [432, 45, 581, 194],
                            uid: 5271,
                            css: {
                                414: {
                                    l: '42.188%',
                                    t: '7.177%',
                                    b: 'auto',
                                    r: 'auto',
                                    lhEID: 0,
                                    lhV: '42.188%',
                                    lhID: -1,
                                    lvEID: 0,
                                    lvV: '7.177%',
                                    lvID: -1,
                                    w: '14.551%',
                                    h: 'auto',
                                    apr: '1.000',
                                    cah: false,
                                    cav: false,
                                    rpmm: {
                                        mw: '4px',
                                        mh: '4px',
                                        Mw: '',
                                        Mh: ''
                                    },
                                    p: 'absolute',
                                    ipiv: 1
                                },
                                768: {
                                    l: '42.188%',
                                    t: '7.177%',
                                    b: 'auto',
                                    r: 'auto',
                                    lhEID: 0,
                                    lhV: '42.188%',
                                    lhID: -1,
                                    lvEID: 0,
                                    lvV: '7.177%',
                                    lvID: -1,
                                    w: '14.551%',
                                    h: 'auto',
                                    apr: '1.000',
                                    cah: false,
                                    cav: false,
                                    rpmm: {
                                        mw: '4px',
                                        mh: '4px',
                                        Mw: '',
                                        Mh: ''
                                    },
                                    p: 'absolute',
                                    ipiv: 1
                                },
                                1024: {
                                    l: '42.188%',
                                    t: '7.177%',
                                    b: 'auto',
                                    r: 'auto',
                                    lhEID: 0,
                                    lhV: '42.188%',
                                    lhID: -1,
                                    lvEID: 0,
                                    lvV: '7.177%',
                                    lvID: -1,
                                    w: '14.551%',
                                    h: 'auto',
                                    apr: '1.000',
                                    cah: false,
                                    cav: false,
                                    rpmm: {
                                        mw: '4px',
                                        mh: '4px',
                                        Mw: '',
                                        Mh: ''
                                    },
                                    p: 'absolute',
                                    ipiv: 1
                                }
                            },
                            dn: 'SmartShape_1',
                            visible: 1,
                            effectiveVi: 1,
                            JSONEffectData: false,
                            accstr: 'Normal ',
                            traccstr: '',
                            ti: -1,
                            sc: '#ffffff',
                            sw: 2,
                            ss: 0,
                            fa: 100,
                            bc: '#ff0000',
                            tb: {
                                414: {
                                    l: '14.09%',
                                    t: '14.09%',
                                    w: '70.71%',
                                    h: '70.71%'
                                },
                                768: {
                                    l: '14.09%',
                                    t: '14.09%',
                                    w: '70.71%',
                                    h: '70.71%'
                                },
                                1024: {
                                    l: '14.09%',
                                    t: '14.09%',
                                    w: '70.71%',
                                    h: '70.71%'
                                }
                            },
                            p0: [
                                [0],
                                [1, 74.5, 0],
                                [3, 33.35, 0, 0, 33.35, 0, 74.5],
                                [3, 0, 115.65, 33.35, 149, 74.5, 149],
                                [3, 115.65, 149, 149, 115.65, 149, 74.5],
                                [3, 149, 33.35, 115.65, 0, 74.5, 0],
                                [4]
                            ],
                            svg: false,
                            vbwr: [428, 41, 585, 198],
                            vb: [428, 41, 585, 198]
                        },
                        si5351: {
                            type: 612,
                            from: 61,
                            to: 150,
                            rp: 0,
                            rpa: 0,
                            mdi: 'si5351c',
                            immo: false,
                            apsn: 'Slide5182',
                            JSONTT_4: [],
                            cpa: true,
                            oca: 'cp.jumpToNextSlide();',
                            JSONTT_5: [],
                            ofa: 'cpCmndResume = 1;',
                            vt: '<div><div style="margin-left:0px;display:block;text-align:center;"><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:20px;font-family:\'Trebuchet MS\';"><span style="">Rollover</span></span><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:20px;font-family:\'Trebuchet MS\';"><br></span></div></div>',
                            rplm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rprm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rptm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rpbm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rpta: {
                                414: 2,
                                768: 2,
                                1024: 2
                            },
                            rptl: {
                                414: 1,
                                768: 1,
                                1024: 1
                            },
                            rpvt: {
                                414: {
                                    vt: '<div><div style="margin-left:0px;display:block;text-align:center;"><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:14px;font-family:\'Trebuchet MS\';"><span style="">Rollover</span></span><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:14px;font-family:\'Trebuchet MS\';"><br></span></div></div>',
                                    text: 'Rollover'
                                },
                                768: {
                                    vt: '<div><div style="margin-left:0px;display:block;text-align:center;"><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:18px;font-family:\'Trebuchet MS\';"><span style="">Rollover</span></span><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:18px;font-family:\'Trebuchet MS\';"><br></span></div></div>',
                                    text: 'Rollover'
                                },
                                1024: {
                                    vt: '<div><div style="margin-left:0px;display:block;text-align:center;"><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:20px;font-family:\'Trebuchet MS\';"><span style="">Rollover</span></span><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:20px;font-family:\'Trebuchet MS\';"><br></span></div></div>',
                                    text: 'Rollover'
                                }
                            },
                            trin: 0,
                            trout: 0,
                            stl: [{
                                stn: 'Normal',
                                stt: 0,
                                stsi: [5351]
                            }],
                            stis: 0,
                            bstiid: 5271,
                            sipst: 9,
                            sicbs: true,
                            sihhs: false,
                            sihds: false
                        },
                        si5351c: {
                            b: [432, 45, 581, 194],
                            uid: 5351,
                            css: {
                                414: {
                                    l: '42.188%',
                                    t: '7.177%',
                                    b: 'auto',
                                    r: 'auto',
                                    lhEID: 0,
                                    lhV: '42.188%',
                                    lhID: -1,
                                    lvEID: 0,
                                    lvV: '7.177%',
                                    lvID: -1,
                                    w: '14.551%',
                                    h: 'auto',
                                    apr: '1.000',
                                    cah: false,
                                    cav: false,
                                    rpmm: {
                                        mw: '4px',
                                        mh: '4px',
                                        Mw: '',
                                        Mh: ''
                                    },
                                    p: 'absolute',
                                    ipiv: 1
                                },
                                768: {
                                    l: '42.188%',
                                    t: '7.177%',
                                    b: 'auto',
                                    r: 'auto',
                                    lhEID: 0,
                                    lhV: '42.188%',
                                    lhID: -1,
                                    lvEID: 0,
                                    lvV: '7.177%',
                                    lvID: -1,
                                    w: '14.551%',
                                    h: 'auto',
                                    apr: '1.000',
                                    cah: false,
                                    cav: false,
                                    rpmm: {
                                        mw: '4px',
                                        mh: '4px',
                                        Mw: '',
                                        Mh: ''
                                    },
                                    p: 'absolute',
                                    ipiv: 1
                                },
                                1024: {
                                    l: '42.188%',
                                    t: '7.177%',
                                    b: 'auto',
                                    r: 'auto',
                                    lhEID: 0,
                                    lhV: '42.188%',
                                    lhID: -1,
                                    lvEID: 0,
                                    lvV: '7.177%',
                                    lvID: -1,
                                    w: '14.551%',
                                    h: 'auto',
                                    apr: '1.000',
                                    cah: false,
                                    cav: false,
                                    rpmm: {
                                        mw: '4px',
                                        mh: '4px',
                                        Mw: '',
                                        Mh: ''
                                    },
                                    p: 'absolute',
                                    ipiv: 1
                                }
                            },
                            dn: 'si5351',
                            visible: 0,
                            effectiveVi: 1,
                            JSONEffectData: false,
                            accstr: 'Rollover ',
                            traccstr: '',
                            ti: -1,
                            sc: '#ffffff',
                            sw: 2,
                            ss: 0,
                            fa: 100,
                            bc: '#ff0000',
                            tb: {
                                414: {
                                    l: '14.09%',
                                    t: '14.09%',
                                    w: '70.71%',
                                    h: '70.71%'
                                },
                                768: {
                                    l: '14.09%',
                                    t: '14.09%',
                                    w: '70.71%',
                                    h: '70.71%'
                                },
                                1024: {
                                    l: '14.09%',
                                    t: '14.09%',
                                    w: '70.71%',
                                    h: '70.71%'
                                }
                            },
                            p0: [
                                [0],
                                [1, 74.5, 0],
                                [3, 33.35, 0, 0, 33.35, 0, 74.5],
                                [3, 0, 115.65, 33.35, 149, 74.5, 149],
                                [3, 115.65, 149, 149, 115.65, 149, 74.5],
                                [3, 149, 33.35, 115.65, 0, 74.5, 0],
                                [4]
                            ],
                            svg: false,
                            vbwr: [428, 41, 585, 198],
                            vb: [428, 41, 585, 198]
                        },
                        SmartShape_2: {
                            type: 612,
                            from: 61,
                            to: 150,
                            rp: 0,
                            rpa: 0,
                            mdi: 'SmartShape_2c',
                            immo: false,
                            apsn: 'Slide5182',
                            JSONTT_4: [],
                            cpa: true,
                            oca: 'cp.jumpToNextSlide();',
                            JSONTT_5: [],
                            ofa: 'cpCmndResume = 1;',
                            vt: '<div><div style="margin-left:0px;display:block;text-align:center;"><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:20px;font-family:\'Trebuchet MS\';"><span style="">Normal</span></span><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:20px;font-family:\'Trebuchet MS\';"><br></span></div></div>',
                            rplm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rprm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rptm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rpbm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rpta: {
                                414: 2,
                                768: 2,
                                1024: 2
                            },
                            rptl: {
                                414: 1,
                                768: 1,
                                1024: 1
                            },
                            rpvt: {
                                414: {
                                    vt: '<div><div style="margin-left:0px;display:block;text-align:center;"><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:14px;font-family:\'Trebuchet MS\';"><span style="">Normal</span></span><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:14px;font-family:\'Trebuchet MS\';"><br></span></div></div>',
                                    text: 'Normal'
                                },
                                768: {
                                    vt: '<div><div style="margin-left:0px;display:block;text-align:center;"><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:18px;font-family:\'Trebuchet MS\';"><span style="">Normal</span></span><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:18px;font-family:\'Trebuchet MS\';"><br></span></div></div>',
                                    text: 'Normal'
                                },
                                1024: {
                                    vt: '<div><div style="margin-left:0px;display:block;text-align:center;"><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:20px;font-family:\'Trebuchet MS\';"><span style="">Normal</span></span><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:20px;font-family:\'Trebuchet MS\';"><br></span></div></div>',
                                    text: 'Normal'
                                }
                            },
                            trin: 0,
                            trout: 0,
                            stl: [{
                                stn: 'Normal',
                                stt: 0,
                                stsi: [5315]
                            }, {
                                stn: 'X_DOWN',
                                stt: 9,
                                stsi: [5365]
                            }],
                            stis: 0,
                            bstiid: -1,
                            sipst: 0,
                            sicbs: false,
                            sihhs: false,
                            sihds: false
                        },
                        SmartShape_2c: {
                            b: [432, 242, 581, 391],
                            uid: 5315,
                            css: {
                                414: {
                                    l: '42.188%',
                                    t: '38.596%',
                                    b: 'auto',
                                    r: 'auto',
                                    lhEID: 0,
                                    lhV: '42.188%',
                                    lhID: -1,
                                    lvEID: 0,
                                    lvV: '38.596%',
                                    lvID: -1,
                                    w: '14.551%',
                                    h: 'auto',
                                    apr: '1.000',
                                    cah: false,
                                    cav: false,
                                    rpmm: {
                                        mw: '4px',
                                        mh: '4px',
                                        Mw: '',
                                        Mh: ''
                                    },
                                    p: 'absolute',
                                    ipiv: 1
                                },
                                768: {
                                    l: '42.188%',
                                    t: '38.596%',
                                    b: 'auto',
                                    r: 'auto',
                                    lhEID: 0,
                                    lhV: '42.188%',
                                    lhID: -1,
                                    lvEID: 0,
                                    lvV: '38.596%',
                                    lvID: -1,
                                    w: '14.551%',
                                    h: 'auto',
                                    apr: '1.000',
                                    cah: false,
                                    cav: false,
                                    rpmm: {
                                        mw: '4px',
                                        mh: '4px',
                                        Mw: '',
                                        Mh: ''
                                    },
                                    p: 'absolute',
                                    ipiv: 1
                                },
                                1024: {
                                    l: '42.188%',
                                    t: '38.596%',
                                    b: 'auto',
                                    r: 'auto',
                                    lhEID: 0,
                                    lhV: '42.188%',
                                    lhID: -1,
                                    lvEID: 0,
                                    lvV: '38.596%',
                                    lvID: -1,
                                    w: '14.551%',
                                    h: 'auto',
                                    apr: '1.000',
                                    cah: false,
                                    cav: false,
                                    rpmm: {
                                        mw: '4px',
                                        mh: '4px',
                                        Mw: '',
                                        Mh: ''
                                    },
                                    p: 'absolute',
                                    ipiv: 1
                                }
                            },
                            dn: 'SmartShape_2',
                            visible: 1,
                            effectiveVi: 1,
                            JSONEffectData: false,
                            accstr: 'Normal ',
                            traccstr: '',
                            ti: -1,
                            sc: '#ffffff',
                            sw: 2,
                            ss: 0,
                            fa: 100,
                            bc: '#40b620',
                            tb: {
                                414: {
                                    l: '14.09%',
                                    t: '14.09%',
                                    w: '70.71%',
                                    h: '70.71%'
                                },
                                768: {
                                    l: '14.09%',
                                    t: '14.09%',
                                    w: '70.71%',
                                    h: '70.71%'
                                },
                                1024: {
                                    l: '14.09%',
                                    t: '14.09%',
                                    w: '70.71%',
                                    h: '70.71%'
                                }
                            },
                            p0: [
                                [0],
                                [1, 74.5, 0],
                                [3, 33.35, 0, 0, 33.35, 0, 74.5],
                                [3, 0, 115.65, 33.35, 149, 74.5, 149],
                                [3, 115.65, 149, 149, 115.65, 149, 74.5],
                                [3, 149, 33.35, 115.65, 0, 74.5, 0],
                                [4]
                            ],
                            svg: false,
                            vbwr: [428, 238, 585, 395],
                            vb: [428, 238, 585, 395]
                        },
                        si5365: {
                            type: 612,
                            from: 61,
                            to: 150,
                            rp: 0,
                            rpa: 0,
                            mdi: 'si5365c',
                            immo: false,
                            apsn: 'Slide5182',
                            JSONTT_4: [],
                            cpa: true,
                            oca: 'cp.jumpToNextSlide();',
                            JSONTT_5: [],
                            ofa: 'cpCmndResume = 1;',
                            vt: '<div><div style="margin-left:0px;display:block;text-align:center;"><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:20px;font-family:\'Trebuchet MS\';"><span style="">Down</span></span><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:20px;font-family:\'Trebuchet MS\';"><br></span></div></div>',
                            rplm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rprm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rptm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rpbm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rpta: {
                                414: 2,
                                768: 2,
                                1024: 2
                            },
                            rptl: {
                                414: 1,
                                768: 1,
                                1024: 1
                            },
                            rpvt: {
                                414: {
                                    vt: '<div><div style="margin-left:0px;display:block;text-align:center;"><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:14px;font-family:\'Trebuchet MS\';"><span style="">Down</span></span><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:14px;font-family:\'Trebuchet MS\';"><br></span></div></div>',
                                    text: 'Down'
                                },
                                768: {
                                    vt: '<div><div style="margin-left:0px;display:block;text-align:center;"><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:18px;font-family:\'Trebuchet MS\';"><span style="">Down</span></span><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:18px;font-family:\'Trebuchet MS\';"><br></span></div></div>',
                                    text: 'Down'
                                },
                                1024: {
                                    vt: '<div><div style="margin-left:0px;display:block;text-align:center;"><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:20px;font-family:\'Trebuchet MS\';"><span style="">Down</span></span><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:20px;font-family:\'Trebuchet MS\';"><br></span></div></div>',
                                    text: 'Down'
                                }
                            },
                            trin: 0,
                            trout: 0,
                            stl: [{
                                stn: 'Normal',
                                stt: 0,
                                stsi: [5365]
                            }],
                            stis: 0,
                            bstiid: 5315,
                            sipst: 9,
                            sicbs: true,
                            sihhs: false,
                            sihds: false
                        },
                        si5365c: {
                            b: [432, 242, 581, 391],
                            uid: 5365,
                            css: {
                                414: {
                                    l: '42.188%',
                                    t: '38.596%',
                                    b: 'auto',
                                    r: 'auto',
                                    lhEID: 0,
                                    lhV: '42.188%',
                                    lhID: -1,
                                    lvEID: 0,
                                    lvV: '38.596%',
                                    lvID: -1,
                                    w: '14.551%',
                                    h: 'auto',
                                    apr: '1.000',
                                    cah: false,
                                    cav: false,
                                    rpmm: {
                                        mw: '4px',
                                        mh: '4px',
                                        Mw: '',
                                        Mh: ''
                                    },
                                    p: 'absolute',
                                    ipiv: 1
                                },
                                768: {
                                    l: '42.188%',
                                    t: '38.596%',
                                    b: 'auto',
                                    r: 'auto',
                                    lhEID: 0,
                                    lhV: '42.188%',
                                    lhID: -1,
                                    lvEID: 0,
                                    lvV: '38.596%',
                                    lvID: -1,
                                    w: '14.551%',
                                    h: 'auto',
                                    apr: '1.000',
                                    cah: false,
                                    cav: false,
                                    rpmm: {
                                        mw: '4px',
                                        mh: '4px',
                                        Mw: '',
                                        Mh: ''
                                    },
                                    p: 'absolute',
                                    ipiv: 1
                                },
                                1024: {
                                    l: '42.188%',
                                    t: '38.596%',
                                    b: 'auto',
                                    r: 'auto',
                                    lhEID: 0,
                                    lhV: '42.188%',
                                    lhID: -1,
                                    lvEID: 0,
                                    lvV: '38.596%',
                                    lvID: -1,
                                    w: '14.551%',
                                    h: 'auto',
                                    apr: '1.000',
                                    cah: false,
                                    cav: false,
                                    rpmm: {
                                        mw: '4px',
                                        mh: '4px',
                                        Mw: '',
                                        Mh: ''
                                    },
                                    p: 'absolute',
                                    ipiv: 1
                                }
                            },
                            dn: 'si5365',
                            visible: 0,
                            effectiveVi: 1,
                            JSONEffectData: false,
                            accstr: 'Down ',
                            traccstr: '',
                            ti: -1,
                            sc: '#ffffff',
                            sw: 2,
                            ss: 0,
                            fa: 100,
                            bc: '#40b620',
                            tb: {
                                414: {
                                    l: '14.09%',
                                    t: '14.09%',
                                    w: '70.71%',
                                    h: '70.71%'
                                },
                                768: {
                                    l: '14.09%',
                                    t: '14.09%',
                                    w: '70.71%',
                                    h: '70.71%'
                                },
                                1024: {
                                    l: '14.09%',
                                    t: '14.09%',
                                    w: '70.71%',
                                    h: '70.71%'
                                }
                            },
                            p0: [
                                [0],
                                [1, 74.5, 0],
                                [3, 33.35, 0, 0, 33.35, 0, 74.5],
                                [3, 0, 115.65, 33.35, 149, 74.5, 149],
                                [3, 115.65, 149, 149, 115.65, 149, 74.5],
                                [3, 149, 33.35, 115.65, 0, 74.5, 0],
                                [4]
                            ],
                            svg: false,
                            vbwr: [428, 238, 585, 395],
                            vb: [428, 238, 585, 395]
                        },
                        SmartShape_3: {
                            type: 612,
                            from: 61,
                            to: 150,
                            rp: 0,
                            rpa: 0,
                            mdi: 'SmartShape_3c',
                            immo: false,
                            apsn: 'Slide5182',
                            JSONTT_4: [],
                            cpa: true,
                            oca: 'cp.jumpToNextSlide();',
                            JSONTT_5: [],
                            ofa: 'cpCmndResume = 1;',
                            vt: '<div><div style="margin-left:0px;display:block;text-align:center;"><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:20px;font-family:\'Trebuchet MS\';"><span style="">Normal</span></span><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:20px;font-family:\'Trebuchet MS\';"><br></span></div></div>',
                            rplm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rprm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rptm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rpbm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rpta: {
                                414: 2,
                                768: 2,
                                1024: 2
                            },
                            rptl: {
                                414: 1,
                                768: 1,
                                1024: 1
                            },
                            rpvt: {
                                414: {
                                    vt: '<div><div style="margin-left:0px;display:block;text-align:center;"><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:14px;font-family:\'Trebuchet MS\';"><span style="">Normal</span></span><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:14px;font-family:\'Trebuchet MS\';"><br></span></div></div>',
                                    text: 'Normal'
                                },
                                768: {
                                    vt: '<div><div style="margin-left:0px;display:block;text-align:center;"><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:18px;font-family:\'Trebuchet MS\';"><span style="">Normal</span></span><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:18px;font-family:\'Trebuchet MS\';"><br></span></div></div>',
                                    text: 'Normal'
                                },
                                1024: {
                                    vt: '<div><div style="margin-left:0px;display:block;text-align:center;"><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:20px;font-family:\'Trebuchet MS\';"><span style="">Normal</span></span><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:20px;font-family:\'Trebuchet MS\';"><br></span></div></div>',
                                    text: 'Normal'
                                }
                            },
                            trin: 0,
                            trout: 0,
                            stl: [{
                                stn: 'Normal',
                                stt: 0,
                                stsi: [5347]
                            }, {
                                stn: 'x_over',
                                stt: 9,
                                stsi: [5379]
                            }, {
                                stn: 'x_down',
                                stt: 9,
                                stsi: [5391, 5413]
                            }],
                            stis: 0,
                            bstiid: -1,
                            sipst: 0,
                            sicbs: false,
                            sihhs: false,
                            sihds: false
                        },
                        SmartShape_3c: {
                            b: [432, 440, 581, 589],
                            uid: 5347,
                            css: {
                                414: {
                                    l: '42.188%',
                                    t: '70.175%',
                                    b: 'auto',
                                    r: 'auto',
                                    lhEID: 0,
                                    lhV: '42.188%',
                                    lhID: -1,
                                    lvEID: 0,
                                    lvV: '70.175%',
                                    lvID: -1,
                                    w: '14.551%',
                                    h: 'auto',
                                    apr: '1.000',
                                    cah: false,
                                    cav: false,
                                    rpmm: {
                                        mw: '4px',
                                        mh: '4px',
                                        Mw: '',
                                        Mh: ''
                                    },
                                    p: 'absolute',
                                    ipiv: 1
                                },
                                768: {
                                    l: '42.188%',
                                    t: '70.175%',
                                    b: 'auto',
                                    r: 'auto',
                                    lhEID: 0,
                                    lhV: '42.188%',
                                    lhID: -1,
                                    lvEID: 0,
                                    lvV: '70.175%',
                                    lvID: -1,
                                    w: '14.551%',
                                    h: 'auto',
                                    apr: '1.000',
                                    cah: false,
                                    cav: false,
                                    rpmm: {
                                        mw: '4px',
                                        mh: '4px',
                                        Mw: '',
                                        Mh: ''
                                    },
                                    p: 'absolute',
                                    ipiv: 1
                                },
                                1024: {
                                    l: '42.188%',
                                    t: '70.175%',
                                    b: 'auto',
                                    r: 'auto',
                                    lhEID: 0,
                                    lhV: '42.188%',
                                    lhID: -1,
                                    lvEID: 0,
                                    lvV: '70.175%',
                                    lvID: -1,
                                    w: '14.551%',
                                    h: 'auto',
                                    apr: '1.000',
                                    cah: false,
                                    cav: false,
                                    rpmm: {
                                        mw: '4px',
                                        mh: '4px',
                                        Mw: '',
                                        Mh: ''
                                    },
                                    p: 'absolute',
                                    ipiv: 1
                                }
                            },
                            dn: 'SmartShape_3',
                            visible: 1,
                            effectiveVi: 1,
                            JSONEffectData: false,
                            accstr: 'Normal ',
                            traccstr: '',
                            ti: -1,
                            sc: '#ffffff',
                            sw: 2,
                            ss: 0,
                            fa: 100,
                            bc: '#0098ff',
                            tb: {
                                414: {
                                    l: '14.09%',
                                    t: '14.09%',
                                    w: '70.71%',
                                    h: '70.71%'
                                },
                                768: {
                                    l: '14.09%',
                                    t: '14.09%',
                                    w: '70.71%',
                                    h: '70.71%'
                                },
                                1024: {
                                    l: '14.09%',
                                    t: '14.09%',
                                    w: '70.71%',
                                    h: '70.71%'
                                }
                            },
                            p0: [
                                [0],
                                [1, 74.5, 0],
                                [3, 33.35, 0, 0, 33.35, 0, 74.5],
                                [3, 0, 115.65, 33.35, 149, 74.5, 149],
                                [3, 115.65, 149, 149, 115.65, 149, 74.5],
                                [3, 149, 33.35, 115.65, 0, 74.5, 0],
                                [4]
                            ],
                            svg: false,
                            vbwr: [428, 436, 585, 593],
                            vb: [428, 436, 585, 593]
                        },
                        si5379: {
                            type: 612,
                            from: 61,
                            to: 150,
                            rp: 0,
                            rpa: 0,
                            mdi: 'si5379c',
                            immo: false,
                            apsn: 'Slide5182',
                            JSONTT_4: [],
                            cpa: true,
                            oca: 'cp.jumpToNextSlide();',
                            JSONTT_5: [],
                            ofa: 'cpCmndResume = 1;',
                            vt: '<div><div style="margin-left:0px;display:block;text-align:center;"><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:20px;font-family:\'Trebuchet MS\';"><span style="">rollover</span></span><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:20px;font-family:\'Trebuchet MS\';"><br></span></div></div>',
                            rplm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rprm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rptm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rpbm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rpta: {
                                414: 2,
                                768: 2,
                                1024: 2
                            },
                            rptl: {
                                414: 1,
                                768: 1,
                                1024: 1
                            },
                            rpvt: {
                                414: {
                                    vt: '<div><div style="margin-left:0px;display:block;text-align:center;"><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:14px;font-family:\'Trebuchet MS\';"><span style="">rollover</span></span><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:14px;font-family:\'Trebuchet MS\';"><br></span></div></div>',
                                    text: 'rollover'
                                },
                                768: {
                                    vt: '<div><div style="margin-left:0px;display:block;text-align:center;"><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:18px;font-family:\'Trebuchet MS\';"><span style="">rollover</span></span><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:18px;font-family:\'Trebuchet MS\';"><br></span></div></div>',
                                    text: 'rollover'
                                },
                                1024: {
                                    vt: '<div><div style="margin-left:0px;display:block;text-align:center;"><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:20px;font-family:\'Trebuchet MS\';"><span style="">rollover</span></span><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:20px;font-family:\'Trebuchet MS\';"><br></span></div></div>',
                                    text: 'rollover'
                                }
                            },
                            trin: 0,
                            trout: 0,
                            stl: [{
                                stn: 'Normal',
                                stt: 0,
                                stsi: [5379]
                            }],
                            stis: 0,
                            bstiid: 5347,
                            sipst: 9,
                            sicbs: true,
                            sihhs: false,
                            sihds: false
                        },
                        si5379c: {
                            b: [432, 440, 581, 589],
                            uid: 5379,
                            css: {
                                414: {
                                    l: '42.188%',
                                    t: '70.175%',
                                    b: 'auto',
                                    r: 'auto',
                                    lhEID: 0,
                                    lhV: '42.188%',
                                    lhID: -1,
                                    lvEID: 0,
                                    lvV: '70.175%',
                                    lvID: -1,
                                    w: '14.551%',
                                    h: 'auto',
                                    apr: '1.000',
                                    cah: false,
                                    cav: false,
                                    rpmm: {
                                        mw: '4px',
                                        mh: '4px',
                                        Mw: '',
                                        Mh: ''
                                    },
                                    p: 'absolute',
                                    ipiv: 1
                                },
                                768: {
                                    l: '42.188%',
                                    t: '70.175%',
                                    b: 'auto',
                                    r: 'auto',
                                    lhEID: 0,
                                    lhV: '42.188%',
                                    lhID: -1,
                                    lvEID: 0,
                                    lvV: '70.175%',
                                    lvID: -1,
                                    w: '14.551%',
                                    h: 'auto',
                                    apr: '1.000',
                                    cah: false,
                                    cav: false,
                                    rpmm: {
                                        mw: '4px',
                                        mh: '4px',
                                        Mw: '',
                                        Mh: ''
                                    },
                                    p: 'absolute',
                                    ipiv: 1
                                },
                                1024: {
                                    l: '42.188%',
                                    t: '70.175%',
                                    b: 'auto',
                                    r: 'auto',
                                    lhEID: 0,
                                    lhV: '42.188%',
                                    lhID: -1,
                                    lvEID: 0,
                                    lvV: '70.175%',
                                    lvID: -1,
                                    w: '14.551%',
                                    h: 'auto',
                                    apr: '1.000',
                                    cah: false,
                                    cav: false,
                                    rpmm: {
                                        mw: '4px',
                                        mh: '4px',
                                        Mw: '',
                                        Mh: ''
                                    },
                                    p: 'absolute',
                                    ipiv: 1
                                }
                            },
                            dn: 'si5379',
                            visible: 0,
                            effectiveVi: 1,
                            JSONEffectData: false,
                            accstr: 'rollover ',
                            traccstr: '',
                            ti: -1,
                            sc: '#ffffff',
                            sw: 2,
                            ss: 0,
                            fa: 100,
                            bc: '#0098ff',
                            tb: {
                                414: {
                                    l: '14.09%',
                                    t: '14.09%',
                                    w: '70.71%',
                                    h: '70.71%'
                                },
                                768: {
                                    l: '14.09%',
                                    t: '14.09%',
                                    w: '70.71%',
                                    h: '70.71%'
                                },
                                1024: {
                                    l: '14.09%',
                                    t: '14.09%',
                                    w: '70.71%',
                                    h: '70.71%'
                                }
                            },
                            p0: [
                                [0],
                                [1, 74.5, 0],
                                [3, 33.35, 0, 0, 33.35, 0, 74.5],
                                [3, 0, 115.65, 33.35, 149, 74.5, 149],
                                [3, 115.65, 149, 149, 115.65, 149, 74.5],
                                [3, 149, 33.35, 115.65, 0, 74.5, 0],
                                [4]
                            ],
                            svg: false,
                            vbwr: [428, 436, 585, 593],
                            vb: [428, 436, 585, 593]
                        },
                        si5391: {
                            type: 612,
                            from: 61,
                            to: 150,
                            rp: 0,
                            rpa: 0,
                            mdi: 'si5391c',
                            immo: false,
                            apsn: 'Slide5182',
                            JSONTT_4: [],
                            cpa: true,
                            oca: 'cp.jumpToNextSlide();',
                            JSONTT_5: [],
                            ofa: 'cpCmndResume = 1;',
                            vt: '<div><div style="margin-left:0px;display:block;text-align:center;"><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:20px;font-family:\'Trebuchet MS\';"><span style="">Down</span></span><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:20px;font-family:\'Trebuchet MS\';"><br></span></div></div>',
                            rplm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rprm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rptm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rpbm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rpta: {
                                414: 2,
                                768: 2,
                                1024: 2
                            },
                            rptl: {
                                414: 1,
                                768: 1,
                                1024: 1
                            },
                            rpvt: {
                                414: {
                                    vt: '<div><div style="margin-left:0px;display:block;text-align:center;"><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:14px;font-family:\'Trebuchet MS\';"><span style="">Down</span></span><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:14px;font-family:\'Trebuchet MS\';"><br></span></div></div>',
                                    text: 'Down'
                                },
                                768: {
                                    vt: '<div><div style="margin-left:0px;display:block;text-align:center;"><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:18px;font-family:\'Trebuchet MS\';"><span style="">Down</span></span><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:18px;font-family:\'Trebuchet MS\';"><br></span></div></div>',
                                    text: 'Down'
                                },
                                1024: {
                                    vt: '<div><div style="margin-left:0px;display:block;text-align:center;"><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:20px;font-family:\'Trebuchet MS\';"><span style="">Down</span></span><span class="cp-actualText" style="line-height:100%;color:#ffffff;font-size:20px;font-family:\'Trebuchet MS\';"><br></span></div></div>',
                                    text: 'Down'
                                }
                            },
                            trin: 0,
                            trout: 0,
                            stl: [{
                                stn: 'Normal',
                                stt: 0,
                                stsi: [5391]
                            }],
                            stis: 0,
                            bstiid: 5347,
                            sipst: 9,
                            sicbs: true,
                            sihhs: false,
                            sihds: false
                        },
                        si5391c: {
                            b: [432, 440, 581, 589],
                            uid: 5391,
                            css: {
                                414: {
                                    l: '42.188%',
                                    t: '70.175%',
                                    b: 'auto',
                                    r: 'auto',
                                    lhEID: 0,
                                    lhV: '42.188%',
                                    lhID: -1,
                                    lvEID: 0,
                                    lvV: '70.175%',
                                    lvID: -1,
                                    w: '14.551%',
                                    h: 'auto',
                                    apr: '1.000',
                                    cah: false,
                                    cav: false,
                                    rpmm: {
                                        mw: '4px',
                                        mh: '4px',
                                        Mw: '',
                                        Mh: ''
                                    },
                                    p: 'absolute',
                                    ipiv: 1
                                },
                                768: {
                                    l: '42.188%',
                                    t: '70.175%',
                                    b: 'auto',
                                    r: 'auto',
                                    lhEID: 0,
                                    lhV: '42.188%',
                                    lhID: -1,
                                    lvEID: 0,
                                    lvV: '70.175%',
                                    lvID: -1,
                                    w: '14.551%',
                                    h: 'auto',
                                    apr: '1.000',
                                    cah: false,
                                    cav: false,
                                    rpmm: {
                                        mw: '4px',
                                        mh: '4px',
                                        Mw: '',
                                        Mh: ''
                                    },
                                    p: 'absolute',
                                    ipiv: 1
                                },
                                1024: {
                                    l: '42.188%',
                                    t: '70.175%',
                                    b: 'auto',
                                    r: 'auto',
                                    lhEID: 0,
                                    lhV: '42.188%',
                                    lhID: -1,
                                    lvEID: 0,
                                    lvV: '70.175%',
                                    lvID: -1,
                                    w: '14.551%',
                                    h: 'auto',
                                    apr: '1.000',
                                    cah: false,
                                    cav: false,
                                    rpmm: {
                                        mw: '4px',
                                        mh: '4px',
                                        Mw: '',
                                        Mh: ''
                                    },
                                    p: 'absolute',
                                    ipiv: 1
                                }
                            },
                            dn: 'si5391',
                            visible: 0,
                            effectiveVi: 1,
                            JSONEffectData: false,
                            accstr: 'Down ',
                            traccstr: '',
                            ti: -1,
                            sc: '#ffffff',
                            sw: 2,
                            ss: 0,
                            fa: 100,
                            bc: '#0098ff',
                            tb: {
                                414: {
                                    l: '14.09%',
                                    t: '14.09%',
                                    w: '70.71%',
                                    h: '70.71%'
                                },
                                768: {
                                    l: '14.09%',
                                    t: '14.09%',
                                    w: '70.71%',
                                    h: '70.71%'
                                },
                                1024: {
                                    l: '14.09%',
                                    t: '14.09%',
                                    w: '70.71%',
                                    h: '70.71%'
                                }
                            },
                            p0: [
                                [0],
                                [1, 74.5, 0],
                                [3, 33.35, 0, 0, 33.35, 0, 74.5],
                                [3, 0, 115.65, 33.35, 149, 74.5, 149],
                                [3, 115.65, 149, 149, 115.65, 149, 74.5],
                                [3, 149, 33.35, 115.65, 0, 74.5, 0],
                                [4]
                            ],
                            svg: false,
                            vbwr: [428, 436, 585, 593],
                            vb: [428, 436, 585, 593]
                        },
                        SmartShape_5: {
                            type: 612,
                            from: 61,
                            to: 150,
                            rp: 0,
                            rpa: 0,
                            mdi: 'SmartShape_5c',
                            immo: false,
                            apsn: 'Slide5182',
                            JSONTT_4: [],
                            cpa: true,
                            oca: 'cp.jumpToNextSlide();',
                            JSONTT_5: [],
                            ofa: 'cpCmndResume = 1;',
                            vt: '',
                            rplm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rprm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rptm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rpbm: {
                                414: 0,
                                768: 0,
                                1024: 0
                            },
                            rpta: {
                                414: 2,
                                768: 2,
                                1024: 2
                            },
                            rptl: {
                                414: 1,
                                768: 1,
                                1024: 1
                            },
                            rpvt: {
                                414: {
                                    vt: '',
                                    text: ''
                                },
                                768: {
                                    vt: '',
                                    text: ''
                                },
                                1024: {
                                    vt: '',
                                    text: ''
                                }
                            },
                            trin: 0,
                            trout: 0,
                            stl: [{
                                stn: 'Normal',
                                stt: 0,
                                stsi: [5413]
                            }],
                            stis: 0,
                            bstiid: 5347,
                            sipst: 9,
                            sicbs: false,
                            sihhs: false,
                            sihds: false
                        },
                        SmartShape_5c: {
                            b: [616, 433, 794, 611],
                            uid: 5413,
                            css: {
                                414: {
                                    l: '60.156%',
                                    t: '69.059%',
                                    b: 'auto',
                                    r: 'auto',
                                    lhEID: 0,
                                    lhV: '60.156%',
                                    lhID: -1,
                                    lvEID: 0,
                                    lvV: '69.059%',
                                    lvID: -1,
                                    w: '17.383%',
                                    h: 'auto',
                                    apr: '1.000',
                                    cah: false,
                                    cav: false,
                                    rpmm: {
                                        mw: '4px',
                                        mh: '4px',
                                        Mw: '',
                                        Mh: ''
                                    },
                                    p: 'absolute',
                                    ipiv: 1
                                },
                                768: {
                                    l: '60.156%',
                                    t: '69.059%',
                                    b: 'auto',
                                    r: 'auto',
                                    lhEID: 0,
                                    lhV: '60.156%',
                                    lhID: -1,
                                    lvEID: 0,
                                    lvV: '69.059%',
                                    lvID: -1,
                                    w: '17.383%',
                                    h: 'auto',
                                    apr: '1.000',
                                    cah: false,
                                    cav: false,
                                    rpmm: {
                                        mw: '4px',
                                        mh: '4px',
                                        Mw: '',
                                        Mh: ''
                                    },
                                    p: 'absolute',
                                    ipiv: 1
                                },
                                1024: {
                                    l: '60.156%',
                                    t: '69.059%',
                                    b: 'auto',
                                    r: 'auto',
                                    lhEID: 0,
                                    lhV: '60.156%',
                                    lhID: -1,
                                    lvEID: 0,
                                    lvV: '69.059%',
                                    lvID: -1,
                                    w: '17.383%',
                                    h: 'auto',
                                    apr: '1.000',
                                    cah: false,
                                    cav: false,
                                    rpmm: {
                                        mw: '4px',
                                        mh: '4px',
                                        Mw: '',
                                        Mh: ''
                                    },
                                    p: 'absolute',
                                    ipiv: 1
                                }
                            },
                            dn: 'SmartShape_5',
                            visible: 0,
                            effectiveVi: 1,
                            JSONEffectData: false,
                            accstr: {
                                414: ' ',
                                768: '  ',
                                1024: '   '
                            },
                            traccstr: '',
                            ti: -1,
                            sc: '#ffffff',
                            sw: 2,
                            ss: 0,
                            fa: 100,
                            bc: '#282828',
                            tb: {
                                414: {
                                    l: '0.00%',
                                    t: '0.00%',
                                    w: '100.00%',
                                    h: '100.00%'
                                },
                                768: {
                                    l: '0.00%',
                                    t: '0.00%',
                                    w: '100.00%',
                                    h: '100.00%'
                                },
                                1024: {
                                    l: '0.00%',
                                    t: '0.00%',
                                    w: '100.00%',
                                    h: '100.00%'
                                }
                            },
                            p0: [
                                [0],
                                [1, 0, 0],
                                [2, 0, 178],
                                [2, 178, 178],
                                [2, 178, 0],
                                [2, 0, 0],
                                [4]
                            ],
                            svg: false,
                            vbwr: [612, 429, 798, 615],
                            vb: [612, 429, 798, 615]
                        },
                        Slide5182: {
                            lb: '',
                            id: 5182,
                            from: 61,
                            to: 150,
                            useng: true,
                            transition: {
                                type: 0
                            },
                            mmot: false,
                            mdi: 'Slide5182c',
                            st: 'Normal Slide',
                            audCC: [],
                            vidCC: [],
                            accstr: ' ',
                            si: [{
                                n: 'si1702',
                                t: 612
                            }, {
                                n: 'si5210',
                                t: 612
                            }, {
                                n: 'SmartShape_1',
                                t: 612
                            }, {
                                n: 'si5351',
                                t: 612
                            }, {
                                n: 'SmartShape_2',
                                t: 612
                            }, {
                                n: 'si5365',
                                t: 612
                            }, {
                                n: 'SmartShape_3',
                                t: 612
                            }, {
                                n: 'si5379',
                                t: 612
                            }, {
                                n: 'si5391',
                                t: 612
                            }, {
                                n: 'SmartShape_5',
                                t: 612
                            }],
                            iph: [],
                            v: false,
                            bc: '#ebebeb',
                            JSONTT_0: [],
                            JSONTT_6: [],
                            qs: ''
                        },
                        Slide5182c: {
                            b: [0, 0, 1024, 627],
                            css: {
                                414: {
                                    l: '0px',
                                    t: '0px',
                                    w: '100%',
                                    h: '466px',
                                    p: 'absolute',
                                    ipiv: 1,
                                    cah: false,
                                    cav: false
                                },
                                768: {
                                    l: '0px',
                                    t: '0px',
                                    w: '100%',
                                    h: '627px',
                                    p: 'absolute',
                                    ipiv: 1,
                                    cah: false,
                                    cav: false
                                },
                                1024: {
                                    l: '0px',
                                    t: '0px',
                                    w: '100%',
                                    h: '627px',
                                    p: 'absolute',
                                    ipiv: 1,
                                    cah: false,
                                    cav: false
                                }
                            },
                            sr: cp.fd,
                            ip: 'dr/1689Tr55.png',
                            dn: 'Slide5182',
                            visible: '1'
                        },
                        quizzingData: {
                            allowBackwardMovement: true,
                            allowReviewMode: true,
                            isInReviewMode: false,
                            allowSkipAnyScoreSlide: true,
                            allowSkipFailScoreSlide: true,
                            allowSkipPassScoreSlide: true,
                            anyGradeAction: '',
                            anyGradeActionArg1: '',
                            anyGradeActionArg2: '',
                            defaultActionType: 'continue',
                            defaultActionArg1: '',
                            defaultActionArg2: '',
                            failedScoreFeedback: 'Sorry, you failed!',
                            failingGradeAction: 'cpCmndResume = 1;',
                            JSONTT_5: [],
                            passedScoreFeedback: 'Congratulations, you passed the quiz!',
                            passingGradeAction: 'cpCmndResume = 1;',
                            JSONTT_4: [],
                            pretestAction: '',
                            it: false,
                            anyScoreSlide: -1,
                            firstSlideInQuiz: -1,
                            lastSlideInQuiz: -1,
                            quizScopeEndSlide: -1,
                            maxScore: 0,
                            minScore: 0,
                            maxPretestScore: 0,
                            numQuestionsInQuiz: 0,
                            numQuizAttemptsAllowed: 1,
                            passingScore: 0,
                            quizInfoCurrentAttempt: 0,
                            quizInfoPercentScored: 0,
                            quizProgress: '',
                            questionAdvance: 'optional',
                            quizAdvance: 'optional',
                            quizID: 377,
                            showFinishButton: true,
                            showProgress: true,
                            questionPoolsInitialized: true,
                            quizInfoAnswerChoice: '',
                            quizInfoAttempts: 1,
                            quizInfoLastSlidePointScored: 0,
                            quizInfoMaxAttemptsOnCurrentQuestion: 1,
                            quizInfoPassFail: 0,
                            quizInfoPointsPerQuestionSlide: 0,
                            quizInfoPointsScored: 0,
                            quizInfoQuestionSlideTiming: 0,
                            quizInfoQuestionSlideType: '',
                            quizInfoQuizPassPercent: 80,
                            quizInfoQuizPassPoints: 0,
                            quizInfoTotalCorrectAnswers: 0,
                            quizInfoTotalProjectPoints: 0,
                            quizInfoTotalQuestionsPerProject: 0,
                            quizInfoTotalQuizPoints: 0,
                            quizInfoTotalUnansweredQuestions: 0,
                            reportingVariables: 0,
                            reportingEnabled: false,
                            submitAll: false,
                            hidePlaybarInQuiz: false,
                            quizBranchAware: false,
                            passFailPassingScoreTypeInPrecent: true,
                            passFailPassingScoreValue: 80,
                            progressIndicatorType: 0,
                            rpViDv: 'This slide was viewed in device with different width.',
                            progressIndicatorString: 'Question %d of %d    '
                        },
                        rtDialog: {
                            rtbgfc: '#ebebeb',
                            rtbgsc: '#4d4d4d',
                            rtbtnfc: '#676767',
                            rtbtnsc: '#676767',
                            rtsc: '#4d4d4d',
                            rttc: '#4d4d4d',
                            rttsc: '#ffffff',
                            rtfn: 'TrebuchetMS',
                            rtt: 'Submit All',
                            rtsam: 'You have answered all questions. What do you want to do next?',
                            rtiqm: 'One or more questions is incomplete. Answer all questions to continue.',
                            rtsiqm: 'You have not answered a few questions yet. Are you sure you want to proceed without answering those questions?',
                            rtsanym: 'You have reached the end of the quiz, but you have unanswered questions. What do you want to do?',
                            rtmtqm: 'You must answer at least one question to continue.',
                            rtokb: 'OK',
                            rtcb: 'CANCEL',
                            rtyb: 'YES',
                            rtnb: 'NO',
                            rtsab: 'Submit All Answers',
                            rtsanyb: 'Submit Anyway',
                            rtrtqb: 'Return to Quiz',
                            rtWarningTitle: 'Adobe Captivate',
                            rtUnsupportedBowser: 'This browser does not support some of the content in the file you are trying to view. Use one of the following browsers:<ul><li>Internet Explorer 9 or later</li><li>Safari 5.1 or later</li><li>Google Chrome 17 or later</li><li>Firefox @FFVERSION or later</li></ul>'
                        },
                        sgMgr: {
                            ri: 0,
                            sg: [
                                [0, [
                                    [1, [23]]
                                ]],
                                [1, [
                                    [2, [23]]
                                ]]
                            ]
                        },
                        project: {
                            fps: 30,
                            hasTOC: 0,
                            w: 1024,
                            h: 627,
                            iw: 1024,
                            ih: 627,
                            prm: [1, 1, 0, 0],
                            cssWidths: [414, 768, 1024],
                            maxWidth: 1024,
                            allbpswidth: [414, 667, 768, 896, 1024],
                            breakpointIdToWidthMap: {
                                1: 1024,
                                2: 768,
                                3: 414
                            },
                            stateNameToLocalizedStateNameMap: {
                                kCPNormalState: 'Normal',
                                kCPDownState: 'Down',
                                kCPRolloverState: 'RollOver',
                                kCPDragoverState: 'DragOver',
                                kCPDragstartState: 'DragStart',
                                kCPDropCorrect: 'DropCorrect',
                                kCPDropIncorrect: 'DropIncorrect',
                                kCPDropAccept: 'DropAccept',
                                kCPDropReject: 'DropReject'
                            },
                            prjBgColor: '#ffffff',
                            pkt: 0,
                            htmlBgColor: '#ffffff',
                            shc: false,
                            pN: 'AUTOSTATE-1'
                        },
                        project_main: {
                            from: 1,
                            to: 150,
                            currentFrame: 1,
                            useResponsive: true,
                            useWidgetVersion7: false,
                            isPublishedFromLacuna: false,
                            slides: 'Slide5238,Slide5259,Slide5182',
                            questions: '',
                            autoplay: true,
                            preloader: true,
                            preloaderFileName: 'dr/loading.gif',
                            preloaderPercentage: 100,
                            preloaderimagel: 497,
                            preloaderimaget: 298,
                            pprtd: false,
                            peon: false,
                            fadeInAtStart: 0,
                            fadeOutAtEnd: 0,
                            endAction: 'cp.stopMovie();'
                        },
                        borderProperties: {
                            hasBorder: false
                        },
                        playBarProperties: {
                            hasPlayBar: true,
                            jsfile: 'playbarScript.js',
                            cssfile: 'playbarStyle.css',
                            position: 3,
                            layout: 3,
                            showOnHover: false,
                            overlay: true,
                            tworow: false,
                            hasRewind: true,
                            hasBackward: true,
                            hasPlay: true,
                            hasSlider: true,
                            hasForward: true,
                            hasCC: false,
                            hasAudioOn: true,
                            hasExit: true,
                            hasFastForward: true,
                            applyColors: true,
                            BkColor: {
                                bc: '#ffffff',
                                alpha: 100
                            },
                            FaceColor: {
                                bc: '#666666',
                                alpha: 100
                            },
                            GlowColor: {
                                bc: '#a3a3a3',
                                alpha: 100
                            },
                            IconColor: {
                                bc: '#ffffff',
                                alpha: 100
                            },
                            alpha: 100,
                            noToolTips: false,
                            locale: 0
                        },
                        tocProperties: {},
                        ccProperties: {
                            w: 1024,
                            h: 57,
                            lc: 3,
                            c: '#ffffff',
                            o: 49,
                            f: 'Times New Roman',
                            fs: 12,
                            tc: '#000000'
                        },
                        trecs: [{
                            link: 5238,
                            text: []
                        }, {
                            link: 5259,
                            text: []
                        }, {
                            link: 5182,
                            text: ['', '', 'Normal', 'Rollover', 'Normal', 'Down', 'Normal', 'rollover', 'Down']
                        }]
                    }
            }
        };

        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should be able to interpret raw Captivate data to get a list of all slide objects in the project", function () {
        expect(_extra.slideObjects.projectSlideObjectNames).toEqual({
            "Widget_1":true,
            "SmartShape_1":true,
            "SmartShape_2":true,
            "SmartShape_3":true,
            "SmartShape_5":true
        });
    });
});