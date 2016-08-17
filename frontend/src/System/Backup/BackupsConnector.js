import _ from 'underscore';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import { executeCommand, registerFinishCommandHandler, unregisterFinishCommandHandler } from 'Stores/Actions/commandActions';
import { fetchBackups } from 'Stores/Actions/systemActions';
import Backups from './Backups';

const backupCommandName = 'Backup';

// TODO: use reselect for perfomance improvements
function mapStateToProps(state) {
  const commands = state.commands.items;
  const backupExecuting = _.some(commands, { name: backupCommandName });

  const {
    fetching,
    items
  } = state.system.backups;

  return {
    fetching,
    items,
    backupExecuting
  };
}

const mapDispatchToProps = {
  executeCommand,
  registerFinishCommandHandler,
  unregisterFinishCommandHandler,
  fetchBackups
};

class BackupsConnector extends Component {

  //
  // Lifecycle

  componentWillMount() {
    this.props.registerFinishCommandHandler({
      key: 'logsTableClearLogs',
      name: backupCommandName,
      handler: fetchBackups
    });

    this.props.fetchBackups();
  }

  componentWillUnmount() {
    this.props.unregisterFinishCommandHandler({ key: 'logsTableClearLogs' });
  }

  //
  // Listeners

  @autobind
  onBackupPress() {
    this.props.executeCommand({ name: backupCommandName });
  }

  //
  // Render

  render() {
    return (
      <Backups
        onBackupPress={this.onBackupPress}
        {...this.props}
      />
    );
  }
}

BackupsConnector.propTypes = {
  executeCommand: PropTypes.func.isRequired,
  registerFinishCommandHandler: PropTypes.func.isRequired,
  unregisterFinishCommandHandler: PropTypes.func.isRequired,
  fetchBackups: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(BackupsConnector);
