import React from 'react';
import $ from 'jquery';
import Album from './Album.jsx';
import Player from './Player.jsx'; 
import appCss from '../css_components/App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artist: {},
      artistID: 0,
      artistName: '',
      albums: [{albumImage: "", songs: [{songName: ""}]}],
      albumPlayingID: 0,
      songPlayingID: 0
    }
  }

  componentDidMount() {
    var artistId = Math.floor(Math.random() * 1000000) + 3000;
    this.getAllArtists(artistId);
  }

  getAllArtists(artistId) {
    $.ajax({
      method: "GET",
      url: `http://127.0.0.1:1600/artists/${artistId}/albums`,
      dataType: "json",
      success: ({artist, albums}) => {
        console.log(artist, albums);
        this.setState({
          artist: artist,
          artistID: artistId,
          artistName: artist.artistName,
          albums: albums
        })
      }
    })
  }

  updateAlbumSongPlaying(albumID, songID) {
    this.setState({
      albumPlayingID: albumID,
      songPlayingID: songID
    });
  }

  buildAlbums() {
    var albums = [];
    for (var i = 0; i < this.state.albums.length; i++) {
      albums.push(
        <div>
          <Album album={this.state.albums[i]} id={i+1} update={this.updateAlbumSongPlaying.bind(this)} 
                albumPlaying={this.state.albumPlayingID} songPlayingID={this.state.songPlayingID}/>
        </div>
      )
    }
    return albums;
  }

  render() {
    return(
      <div>
        <div className={appCss.albumsModule}>
          <h3 id={appCss.AppAlbumTitle}>Albums</h3>
          <hr id={appCss.horizLine}/>
          <div>
            {this.buildAlbums()}
          </div>
        </div>
        <div className={appCss.playerModule}><Player artist={this.state.artistName} 
                                               albums={this.state.albums} 
                                               albumPlaying={this.state.albumPlayingID}
                                               songPlaying={this.state.songPlayingID}
                                               updateAlbumSongPlaying={this.updateAlbumSongPlaying.bind(this)}/></div>
      </div>
    )
  }
}

export default App;