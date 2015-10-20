/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 27/09/15
 * Time: 4:15 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("softwareInterfacesManager", function () {

    "use strict";

    // Define a private object to hold the references to the different poitns in
    // the Captivate API
    _extra.captivate = {
        "api":_extra.w.cp,
        "version":_extra.w.CaptivateVersion,
        "variables":_extra.w,
        "interface":_extra.w.cpAPIInterface,
        "eventDispatcher":_extra.w.cpAPIEventEmitter,
        "model":_extra.w.cp.model,
        "allSlideObjectsData":_extra.w.cp.model.data,
        "events":{
            /**
             * Event Data:
             * - slideNumber
             * - frameNumber
             * - lcpversion (?)
             */
            "SLIDE_ENTER":"CPAPI_SLIDEENTER",
            /**
             * Event Data:
             * - slideNumber
             * - frameNumber
             * - lcpversion (?)
             * - percentageSlideSeen = NUMBER
             */
            "SLIDE_EXIT":"CPAPI_SLIDEEXIT",
            "PLAYBAR_SCRUBBING_BEGIN":"CPAPI_STARTPLAYBARSCRUBBING",
            "PLAYBAR_SCRUBBING_END":"CPAPI_ENDPLAYBARSCRUBBING",
            /**
             * Event Data:
             * - frameNumber
             * - includedInQuiz
             * - issuccess
             * - itemname
             * - objecttype
             * - questioneventdata
             * - slideNumber
             */
            "INTERACTIVE_ITEM_SUBMIT":"CPAPI_INTERACTIVEITEMSUBMIT",
            "MOVIE_PAUSE":"CPAPI_MOVIEPAUSE",
            "MOVIE_RESUME":"CPAPI_MOVIERESUME",
            "MOVIE_START":"CPAPI_MOVIESTART",
            "MOVIE_STOP":"CPAPI_MOVIESTOP",
            /**
             * Event Data:
             * - correctAnswer=STRING;
             * - infiniteAttempts=BOOLEAN;
             * - interactionID=NUMBER;
             * - objectiveID=STRING;
             * - questionAnswered=BOOLEAN;
             * - questionAnsweredCorrectly=BOOLEAN;
             * - questionAttempts=NUMBER;
             * - questionMaxAttempts=NUMBER;
             * - questionMaxScore=NUMBER;
             * - questionNumber=NUMBER;
             * - questionScore=NUMBER;
             * - questionScoringType=[object Object],{Name:STRING};
             * - questionType=STRING;
             * - quizName=STRING;
             * - reportAnswers=BOOLEAN;
             * - selectedAnswer=STRING;
             * - slideNumber=NUMBER;
             */
            "QUESTION_SKIP":"CPAPI_QUESTIONSKIP",
            /**
             * Event Data:
             * - correctAnswer=STRING;
             * - infiniteAttempts=BOOLEAN;
             * - interactionID=NUMBER;
             * - objectiveID=STRING;
             * - questionAnswered=BOOLEAN;
             * - questionAnsweredCorrectly=BOOLEAN;
             * - questionAttempts=NUMBER;
             * - questionMaxAttempts=NUMBER;
             * - questionMaxScore=NUMBER;
             * - questionNumber=NUMBER;
             * - questionScore=NUMBER;
             * - questionScoringType=[object Object],{Name:STRING};
             * - questionType=STRING;
             * - quizName=STRING;
             * - reportAnswers=BOOLEAN;
             * - selectedAnswer=STRING;
             * - slideNumber=NUMBER;
             */
            "QUESTION_SUBMIT":"CPAPI_QUESTIONSUBMIT",
            /**
             * Subscribing to this event requires a third parameter to be passed into the eventListener method.
             * This third parameter should be the name of the Captivate Variable you wish to listen for.
             *
             * Event Data:
             * - captivateVersion=STRING;
             * - varName=STRING;
             * - oldVal=STRIN;
             * - newVal=STRING;
             */
            "VARIABLE_VALUE_CHANGED":"CPAPI_VARIABLEVALUECHANGED"

        }
    };

}, _extra.CAPTIVATE);