package com.trainer.security;

import com.trainer.exception.AuthenticationException;
import net.oauth.*;
import net.oauth.signature.OAuthSignatureMethod;
import net.paulgray.lti.launch.HMAC_SHA256;
import net.paulgray.lti.launch.LtiOauth10aVerifier;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Collection;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class LtiSignatureVerifier {
    public static final String OAUTH_KEY_PARAMETER = "oauth_consumer_key";
    private static final Logger log = Logger.getLogger(LtiOauth10aVerifier.class.getName());

    public LtiSignatureVerifier() {
    }

    public void verifyParameters(Collection<? extends Map.Entry<String, String>> requestParams,
                                 String requestURL, String requestMethod, String ltiSecretKey) throws Exception{
        OAuthMessage oAuthMessage = new OAuthMessage(requestMethod, requestURL, requestParams);
        Optional oauthConsumerKey = requestParams.stream()
                .filter((p) -> (p.getKey()).equals("oauth_consumer_key"))
                .map(Map.Entry::getValue).findFirst();
        if (!oauthConsumerKey.isPresent()) {
            throw new AuthenticationException("LTI Authentication error. Missing oauth consumer key");
        } else {
            String key = (String)oauthConsumerKey.get();
            OAuthConsumer oAuthConsumer = new OAuthConsumer((String)null, key, ltiSecretKey, (OAuthServiceProvider)null);
            SimpleOAuthValidator oAuthValidator = new SimpleOAuthValidator(60*60*1000, Double.parseDouble("1.0"));
            OAuthAccessor oAuthAccessor = new OAuthAccessor(oAuthConsumer);
            oAuthValidator.validateMessage(oAuthMessage, oAuthAccessor);
        }
    }

    static {
        OAuthSignatureMethod.registerMethodClass("HMAC-SHA256", HMAC_SHA256.class);
    }
}
