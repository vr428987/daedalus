// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { defineMessages, intlShape, FormattedHTMLMessage } from 'react-intl';
import { Button } from 'react-polymorph/lib/components/Button';
import { Checkbox } from 'react-polymorph/lib/components/Checkbox';
import { CheckboxSkin } from 'react-polymorph/lib/skins/simple/CheckboxSkin';
import { ButtonSkin } from 'react-polymorph/lib/skins/simple/ButtonSkin';
import ReactMarkdown from 'react-markdown';
import News from '../../domains/News';
import styles from './UpdateOverlay.scss';
import DialogCloseButton from '../widgets/DialogCloseButton';
import ProgressBarLarge from '../widgets/ProgressBarLarge';

const messages = defineMessages({
  title: {
    id: 'news.updateOverlay.title',
    defaultMessage: '!!!Software update available!',
    description: 'title for the Update Overlay',
  },
  subtitle: {
    id: 'news.updateOverlay.subtitle',
    defaultMessage:
      '!!!You are currently running Daedalus version {currentVersion}.<br />Daedalus version {availableVersion} is now available to download.',
    description: 'subtitle for the Update Overlay',
  },
  checkboxLabel: {
    id: 'news.updateOverlay.checkboxLabel',
    defaultMessage:
      '!!!I understand that I need to complete the installation before starting Daedalus.',
    description: 'checkboxLabel for the Update Overlay',
  },
  buttonLabel: {
    id: 'news.updateOverlay.buttonLabel',
    defaultMessage: '!!!Quit Daedalus and start the installation',
    description: 'buttonLabel for the Update Overlay',
  },
  downloadProgressLabel: {
    id: 'news.updateOverlay.downloadProgressLabel',
    defaultMessage: '!!!Download in progress',
    description: 'downloadProgressLabel for the Update Overlay',
  },
  downloadTimeLeft: {
    id: 'news.updateOverlay.downloadTimeLeft',
    defaultMessage: '!!!{downloadTimeLeft} left',
    description: 'downloadTimeLeft for the Update Overlay',
  },
  downloadProgressData: {
    id: 'news.updateOverlay.downloadProgressData',
    defaultMessage: '!!!({totalDownloaded} of {totalDownloadSize} downloaded)',
    description: 'downloadProgressData for the Update Overlay',
  },
});

type Props = {
  update: News.News,
  onCloseUpdate: Function,
  downloadTimeLeft: string,
  totalDownloaded: string,
  totalDownloadSize: string,
  currentVersion: string,
  availableVersion: string,
  downloadProgress: number,
  isUpdateDownloaded: boolean,
  onInstallUpdate: Function,
};

type State = {
  areTermsOfUseAccepted: boolean,
};

@observer
export default class UpdateOverlay extends Component<Props, State> {
  static contextTypes = {
    intl: intlShape.isRequired,
  };

  state = {
    areTermsOfUseAccepted: false,
  };

  toggleAcceptance = () => {
    this.setState(prevState => ({
      areTermsOfUseAccepted: !prevState.areTermsOfUseAccepted,
    }));
  };

  render() {
    const { intl } = this.context;
    const {
      update,
      onCloseUpdate,
      downloadTimeLeft,
      totalDownloaded,
      totalDownloadSize,
      downloadProgress,
      isUpdateDownloaded,
      onInstallUpdate,
      currentVersion,
      availableVersion,
    } = this.props;
    const { areTermsOfUseAccepted } = this.state;
    const { content } = update;
    const buttonStyles = [
      styles.button,
      !areTermsOfUseAccepted ? styles.disabled : null,
    ];
    return (
      <div
        className={styles.component}
        role="presentation"
        onClick={!isUpdateDownloaded ? onCloseUpdate : () => {}}
      >
        {!isUpdateDownloaded && (
          <DialogCloseButton
            onClose={onCloseUpdate}
            className={styles.closeButton}
          />
        )}
        <h1 className={styles.title}>{intl.formatMessage(messages.title)}</h1>
        <span className={styles.subtitle}>
          <FormattedHTMLMessage
            {...messages.subtitle}
            values={{
              currentVersion,
              availableVersion,
            }}
          />
        </span>
        <div className={styles.content}>
          <ReactMarkdown escapeHtml={false} source={content} />
        </div>
        {!isUpdateDownloaded ? (
          <div className={styles.downloadProgress}>
            <div className={styles.downloadProgressContent}>
              <p className={styles.downloadProgressLabel}>
                {intl.formatMessage(messages.downloadProgressLabel)}
              </p>
              <p className={styles.downloadProgressData}>
                <b>
                  {intl.formatMessage(messages.downloadTimeLeft, {
                    downloadTimeLeft,
                  })}
                </b>{' '}
                {intl.formatMessage(messages.downloadProgressData, {
                  totalDownloaded,
                  totalDownloadSize,
                })}
              </p>
            </div>
            <ProgressBarLarge progress={downloadProgress} />
          </div>
        ) : (
          <div className={styles.actions}>
            <Checkbox
              label={intl.formatMessage(messages.checkboxLabel)}
              onChange={this.toggleAcceptance}
              className={styles.checkbox}
              checked={areTermsOfUseAccepted}
              skin={CheckboxSkin}
              themeOverrides={styles.checkbox}
            />
            <Button
              className={buttonStyles}
              onClick={onInstallUpdate}
              skin={ButtonSkin}
              label={intl.formatMessage(messages.buttonLabel)}
              disabled={!areTermsOfUseAccepted}
            />
          </div>
        )}
      </div>
    );
  }
}
