import React from 'react';
import { string, arrayOf, shape } from 'prop-types';
import { Link } from 'react-router-dom';

const ArtistList = ({ className, artists }) => (
  <span className={className}>
    {
      artists.map((artist, index) => (
        <Link to={`/artist/${artist.artist_id}`}>
          <span>{artist.artist_name}</span>{ artists.length > 1 && (index < artists.length - 1) ? <span>,&nbsp;</span> : null }
        </Link>
      ))
    }
  </span>
);

ArtistList.propTypes = {
  className: string,
  artists: arrayOf(shape({})),
};

ArtistList.defaultProps = {
  className: '',
  artists: [],
};

module.exports = ArtistList;
