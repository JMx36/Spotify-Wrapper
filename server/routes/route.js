const express = require('express');
const router = express.Router();
router.use(express.json());

// Import Fetch implementation
const axios = require('axios');
const fs = require('fs');
// const { json } = require('stream/consumers');

let loadedFiles = false;

const redirect_uri = 'http://localhost:8888/callback';

let my_client_id = null;
let my_client_secret = null;

let access_token = null;
let refresh_token = null;
let client_uri = 'http://localhost:4200';

let state = ""
const scopes = "user-read-private user-read-email streaming user-modify-playback-state"


async function loadSecretsAndTokens() {
    try {
        const [clientSecretData, tokenData] = await Promise.all([
            fs.promises.readFile('./secrets/client_secrets.json', 'utf-8'),
            fs.promises.readFile('./secrets/tokens.json', 'utf-8')
        ]);

        const clientSecrets = JSON.parse(clientSecretData);
        const tokens = JSON.parse(tokenData);

        my_client_id = clientSecrets.client_id;
        my_client_secret = clientSecrets.client_secret;
        access_token = tokens.access_token;
        refresh_token = tokens.refresh_token;
        console.log(my_client_id);
        console.log(my_client_secret);
        loadedFiles = true;
        console.log('Secrets and tokens loaded successfully.');
    } catch (err) {
        console.error('Failed to load secrets or tokens:', err);
        process.exit(1); // Stop server if critical files are missing
    }
}

loadSecretsAndTokens()

const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_.-';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((accumulator, current) => accumulator + possible[current % possible.length], '')
}

async function internal_TokenHandler(type = 'new', code = ''){
    const spotify_token_url = "https://accounts.spotify.com/api/token";
    const isRefresh = type === "refresh";

    let headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(my_client_id + ':' + my_client_secret).toString('base64')}`
    }

    let body = new URLSearchParams();

    if (isRefresh)
    {
        body.append('grant_type', 'refresh_token');
        body.append('refresh_token', refresh_token);
    }
    else
    {
        body.append('grant_type', 'authorization_code');
        body.append('code', code);
        body.append('redirect_uri', redirect_uri);
    }

    try {
        
        if (isRefresh && !refresh_token)
        {
            throw new Error('No Refresh Token found');
        }

        const response = await axios.post(spotify_token_url, body.toString(), {headers: headers});
        const data = response.data;

        access_token = data.access_token;
        console.log('New Tokens');

        console.log('Access Token:', access_token);

        if (data.refresh_token){
            refresh_token = data.refresh_token;
            console.log('Refresh token:', refresh_token);
        }
        else{
            console.warn('No refresh token');
            refresh_token = null;
        }

        fs.writeFile('./secrets/tokens.json', JSON.stringify({access_token: access_token, refresh_token: refresh_token}, null, 2), () => {
			return Promise.resolve();
		});

        return {success: true};

    } catch (error) {

        let message = '';
        
        console.error('Failed to get access token:', error.message)

        if (error.response) {
            
            console.error('Error response status:', error.response.status);
            console.error('Error data:', error.response.data);

            message = error.response.status >= 500 ?
                    'Server Error: Failed to get Access token from Spotify API' :
                    'Spotify API did not return a "ok" status'

        } else {
            console.error('Network or other error:', error.message);
            message = 'Server Error';
        }

        access_token = null;
        refresh_token = null;

        return {success: false, error: message}
        
    }

}


async function refreshToken() {
    // refresh tokens
    return internal_TokenHandler('refresh');
}

async function createToken(code){
    return internal_TokenHandler('new', code);
}

function makeAPIPut(){}


// Useful continuous stream request
// it uses the res parameter to return data to the original caller
async function makeAPIRequest(url, res){
    const headers = {
        'Authorization': `Bearer ${access_token}`
    }

    try {

        let response = await axios.get(url, {headers: headers});

        console.log(response.data);

        res.json(response.data);

        return;
        
    } catch (error) {
        
        // console.log(error);
        console.error('Failed first attempt. Attempting to refresh tokens');

        const token_req_data = await refreshToken(); 
        
        // console.log('Refresh Token request')
        // console.log(token_req_data)

        if (!token_req_data.success)
        {
            res.status(400).json({ error: token_req_data.error });
            return;
        }
        
    }

    headers['Authorization'] = `Bearer ${access_token}`


    try {
        
        let response = await axios.get(url, headers);

        res.json(response.data);
        
        return;   
        
    } catch (error) {

        // console.error(error);
        res.status(400).json({ error: `Error: Couldn't get data from url ${url}` })

    }

}

router.get('/login', function(req, res){
    
    state = generateRandomString(16);
    console.log('State', state);
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: my_client_id,
        scope: scopes,
        redirect_uri: redirect_uri,
        state: state
      })

    res.redirect('https://accounts.spotify.com/authorize?' +
        params.toString());
});

router.get('/callback', async function(req, res) {
    let code = req.query.code || null;
    let query_state = req.query.state || null;

    // redirect if state missing or mismatch
    if (query_state === null || query_state !== state)
    {
        params = new URLSearchParams({
            error: 'state_mismatch'
        });

        res.redirect(`/#${params}`);

        return;
    }

    await createToken(code);
    
    res.redirect(client_uri);

});

router.get('/me', function(req, res, next) {
	makeAPIRequest('https://api.spotify.com/v1/me', res);
});

router.get('/login-status', function(req, res, next){
    res.json({ status : access_token !== null});
    // res.json({ status : true});
});

module.exports = router;