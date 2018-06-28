import './index.css'
import React from 'react'
import * as PropTypes from 'prop-types'
import podcast from './podcast.mp3'
import mario from './mariobros.mp3'
import FaPause from 'react-icons/lib/fa/pause'
import FaPlay from 'react-icons/lib/fa/play'
import FaRepeat from 'react-icons/lib/fa/repeat'
import FaRotateLeft from 'react-icons/lib/fa/rotate-left'

class AudioPlayer extends React.Component {

  constructor(props) {
    super(props);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.onTimeUpdate = this.onTimeUpdate.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.setCurrentTime = this.setCurrentTime.bind(this);
    this.onLoadedData = this.onLoadedData.bind(this);
    this.state = {
      isPlaying: false,
      play: this.play,
      pause: this.pause,
      progress: 0,
      currentTime: 0,
      setCurrentTime: this.setCurrentTime,
      duration: 0
    }
  }

  static childContextTypes = {
    isPlaying: PropTypes.bool.isRequired,
    play: PropTypes.func.isRequired,
    pause: PropTypes.func.isRequired,
    progress: PropTypes.number.isRequired,
    currentTime: PropTypes.number.isRequired,
    setCurrentTime: PropTypes.func.isRequired,
    duration: PropTypes.number.isRequired,
  };

  setCurrentTime(time) {
    this.audio && (this.audio.currentTime = time)
  }

  play(e) {
    e.preventDefault();
    this.audio.play();
    this.setState({isPlaying: true})
  }

  pause(e) {
    e.preventDefault();
    this.audio.pause();
    this.setState({isPlaying: false})
  }

  getChildContext() {
    return this.state;
  }

  onTimeUpdate(e) {
    e.preventDefault();
    this.setState({
      progress: 100 * e.target.currentTime / this.audio.duration,
      currentTime: e.target.currentTime,
    })
  }

  onEnd() {
    this.audio.currentTime = 0;
    this.setState({
      isPlaying: false,
      progress: 0,
    })
  }

  onLoadedData(e) {
    this.setState({duration: this.audio.duration})
  }

  render() {
    return (
      <div className="audio-player">
        <audio
          src={this.props.source}
          onTimeUpdate={this.onTimeUpdate}
          onLoadedData={this.onLoadedData}
          onEnded={this.onEnd}
          ref={n => this.audio = n}
        />
        {this.props.children}
      </div>
    )
  }
}

class Play extends React.Component {

  static contextTypes = {
    isPlaying: PropTypes.bool.isRequired,
    play: PropTypes.func.isRequired,
  };

  render() {
    return (
      <button
        className="icon-button"
        onClick={this.context.play}
        disabled={this.context.isPlaying}
        title="play"
      >
        <FaPlay/>
      </button>
    )
  }
}

class Pause extends React.Component {
  static contextTypes = {
    isPlaying: PropTypes.bool.isRequired,
    pause: PropTypes.func.isRequired,
  };

  render() {
    return (
      <button
        className="icon-button"
        onClick={this.context.pause}
        disabled={!this.context.isPlaying}
        title="pause"
      ><FaPause/></button>
    )
  }
}

class PlayPause extends React.Component {
  static contextTypes = {
    isPlaying: PropTypes.bool.isRequired,
    pause: PropTypes.func.isRequired,
    play: PropTypes.func.isRequired,
  };

  getChildContextTypes() {
    return this.context;
  }

  render() {
    return !this.context.isPlaying ? <Play/> : <Pause/>;
  }
}

class JumpForward extends React.Component {

  static contextTypes = {
    isPlaying: PropTypes.bool.isRequired,
    setCurrentTime: PropTypes.func.isRequired,
    currentTime: PropTypes.number.isRequired,
  };

  render() {
    let {isPlaying, setCurrentTime, currentTime} = this.context;
    return (
      <button
        className="icon-button"
        onClick={() => setCurrentTime(currentTime + 10)}
        disabled={!isPlaying}
        title="Forward 10 Seconds"
      ><FaRepeat/></button>
    )
  }
}

class JumpBack extends React.Component {
  static contextTypes = {
    isPlaying: PropTypes.bool.isRequired,
    setCurrentTime: PropTypes.func.isRequired,
    currentTime: PropTypes.number.isRequired,
  };

  render() {
    let {isPlaying, setCurrentTime, currentTime} = this.context;

    return (
      <button
        className="icon-button"
        onClick={() => setCurrentTime(currentTime - 10)}
        disabled={!isPlaying}
        title="Back 10 Seconds"
      >
        <FaRotateLeft/>
      </button>
    )
  }
}

class Progress extends React.Component {

  static contextTypes = {
    progress: PropTypes.number.isRequired,
    setCurrentTime: PropTypes.func.isRequired,
    currentTime: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    isPlaying: PropTypes.bool.isRequired,
  };

  onClick(e) {
    if(!this.context.isPlaying) return;
    let clickOffset = e.clientX;
    let nodeOffset = this.node.offsetLeft;
    let width = this.node.getBoundingClientRect().width;
    if (e.clientX < nodeOffset) return;
    this.context.setCurrentTime((clickOffset - nodeOffset) * this.context.duration / width)
  }

  render() {
    return (
      <div
        className="progress"
        onClick={this.onClick.bind(this)}
        ref={n => this.node = n}
      >
        <div
          className="progress-bar"
          style={{
            width: `${this.context.progress}%`
          }}
        />
      </div>
    )
  }
}

const Exercise = () => (
  <div className="exercise">
    <AudioPlayer source={mario}>
      <Play/> <Pause/>{' '}
      <span className="player-text">Mario Bros. Remix</span>
      <Progress/>
    </AudioPlayer>

    <AudioPlayer source={podcast}>
      <PlayPause/> <JumpBack/> <JumpForward/> {' '}
      <span className="player-text">React30 Episode 010: React Virtualized</span>
      <Progress/>
    </AudioPlayer>
  </div>
);


export default Exercise
