import * as React from 'react';
import {FullscreenButton} from "../FullscreenButton";
import {mountWithIntl} from "../../../__tests__/environment/Environment";
import {GoScreenFull, GoScreenNormal} from "react-icons/go";
import {formatMessage, i18n} from "../../../__tests__/environment/IntlUtil";

describe('Button Fullscreen', () => {
    it('button in fullscreen', () => {
        const toggleFullScreen = () => {
            ;
        };
        const wrapper = mountWithIntl(<FullscreenButton
            toggleFullscreen={toggleFullScreen}
            isFullscreen={true}
            i18n={i18n}
            formatMessage={formatMessage}
        />);
        expect(wrapper.find(GoScreenNormal).exists()).toBeTruthy();
    });
    it('button in window', () => {
        const toggleFullScreen = () => {
            ;
        };
        const wrapper = mountWithIntl(<FullscreenButton
            toggleFullscreen={toggleFullScreen}
            isFullscreen={false}
            i18n={i18n}
            formatMessage={formatMessage}
        />);
        expect(wrapper.find(GoScreenFull).exists()).toBeTruthy();
    });
});