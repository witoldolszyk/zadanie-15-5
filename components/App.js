var GIPHY_API_URL ='//api.giphy.com/v1/gifs/';
var GIPHY_PUB_KEY ='dc6zaTOxFJmzC';
App = React.createClass({
        getInitialState() {
        return {
            loading: false,
            searchingText: '',
            gif: {}
        };
      },

      handleSearch: function(searchingText) {
        this.setState({
          loading: true
        });
        this.getGif(searchingText, function(gif) {
          this.setState({
            loading: false,
            gif: gif,
            searchingText: searchingText
          });
        }.bind(this));
      },

      getGif: function(searchingText, callback) {
          var url = GIPHY_API_URL + '/v1/gifs/random?api_key=' + GIPHY_PUB_KEY + '&tag=' + searchingText;
          /* Wywałenie promisa */
          this.Gif(url).then(response => imgGif(response));
          function imgGif(oneGif) {
            var gif = {
              url: oneGif.fixed_width_downsampled_url,
              sourceUrl: oneGif.url
            };
            callback(gif);
          }
      },
      /* Konstrukcja promisa */
      Gif: function (url) {
        return new Promise(
          function (resolve, reject) {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
              if (this.status === 200) {
                resolve(JSON.parse(this.responseText).data);
              } else {
                reject(new Error(this.statusText));
              }
            };
            xhr.onerror = function () {
              reject(new Error(
                `XMLHttpRequest Error: ${this.statusText}`));
            };
            xhr.open('GET', url);
            xhr.send();
        });
      },

    render: function() {

        var styles = {
            margin: '0 auto',
            textAlign: 'center',
            width: '90%'
        };

        return (
          <div style={styles}>
            <h1>Wyszukiwarka GIFow!</h1>
            <p>Znajdź gifa na <a href='http://giphy.com'>giphy</a>. Naciskaj enter, aby pobrać kolejne gify.</p>
            <Search onSearch={this.handleSearch}/>
            <Gif
              loading={this.state.loading}
              url={this.state.gif.url}
              sourceUrl={this.state.gif.sourceUrl}
            />
          </div>
        );
    }
});
