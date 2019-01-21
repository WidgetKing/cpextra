/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 1/10/15
 * Time: 2:36 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("dataTypeConverters",["globalSlideObjectTypes"], function () {

    "use strict";

    _extra.dataTypes.convertSlideObjectType = function (cpType, name) {

        var soTypes = _extra.dataTypes.slideObjects;

        switch (cpType) {

            case 12 :
                return soTypes.MOUSE;

            case 13 :
                return soTypes.CLICK_BOX;

            case 14 :
                return soTypes.HIGHLIGHT_BOX;

            case 15 :
                return soTypes.IMAGE;

            case 19 :
            case 22 : // Failure caption
            case 79 : // kCPOTStageQuestionText
            case 86 : // kCPOTStageQuestionTitle
                return soTypes.CAPTION;

            case 24 :
            case 10094 :
                return soTypes.TEXT_ENTRY_BOX;

            case 28 :
                return soTypes.ANIMATION;

            case 75 :
            case 91 : // kCPOTStageQuestionSubmitButton
            case 103 : // kCPOTScoringReviewButton
            case 177 :
            case 641 : // Drag and Drop submit button
            case 10119 : // kCPOTScoringContinueButton
            case 10180 : // kCPOTStageQuestionReviewModeNextButton
            case 10182 : // kCPOTStageQuestionReviewModeBackButton
                return soTypes.BUTTON;

            case 94 : // Review Area
                return soTypes.REVIEW_AREA;

            case 98 :
                return soTypes.VIDEO;

            case 99 :
                return soTypes.ZOOM_AREA;

            case 133 :
                return soTypes.WIDGET;

            case 142 :
            case 589 :
            case 612 :
            case 661 : // Success caption / shape
            case 663 : // Failure caption / shape
            case 10166 : // kCPOTStageCorrectFeedbackShape
            case 10168 : // kCPOTStageIncorrectFeedbackShape
            case 10170 : // kCPOTStagePartialCorrectFeedbackShape
            case 10174 : // kCPOTIncompleteFeedbackShape
                return soTypes.SHAPE;

            case 652 :
                return soTypes.WEB_OBJECT;

            case 15728652 :
                return soTypes.MOUSE_CLICK;

            case 80 : // kCPOTStageAnswerItem
            case 92 : // kCPOTProgressIndicator
            case 111 : // kCPOTScoringResult
            case 112 : // kCPOTScoringResultItem
            case 10088 : // kCPOTStageAnswerLabel
            case 683 : // kCPOTFlexBoxBackgroundItem
            case "radio" :
                return soTypes.UNKNOWN;

            default :
                if (cpType !== undefined) {
                    _extra.log(name + " has unknown type: " + cpType);
                }
                return soTypes.UNKNOWN;
        }
    };

}, _extra.CAPTIVATE);