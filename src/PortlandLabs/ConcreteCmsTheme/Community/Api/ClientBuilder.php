<?php

namespace PortlandLabs\ConcreteCmsTheme\Community\Api;

use Concrete\Core\Application\ApplicationAwareInterface;
use Concrete\Core\Application\ApplicationAwareTrait;
use GuzzleHttp\Client as GuzzleClient;
use League\OAuth2\Client\Provider\GenericProvider;

class ClientBuilder implements ApplicationAwareInterface
{
    use ApplicationAwareTrait;

    public function isEnabled(): bool
    {
        return filter_var($_ENV['COMMUNITY_API_ENABLED'] ?? true, FILTER_VALIDATE_BOOL);
    }

    public function getClient(): GuzzleClient
    {
        $provider = new GenericProvider(
            [
                'clientId' => $_ENV['COMMUNITY_API_CLIENT_ID'],
                'clientSecret' => $_ENV['COMMUNITY_API_CLIENT_SECRET'],
                'redirectUri' => '',
                'urlAccessToken' => $_ENV['URL_SITE_COMMUNITY'] . '/oauth/2.0/token',
                'urlAuthorize' => $_ENV['URL_SITE_COMMUNITY'] . '/oauth/2.0/authorize',
                'urlResourceOwnerDetails' => $_ENV['URL_SITE_COMMUNITY'] . '/ccm/api/1.0/account/info',
            ]
        );
        $config = [
            'grant_type' => 'client_credentials',
            'scope' => [
                'users:read',
                'users:stripe:modify',
            ]
        ];
        $cache = $this->app->make('cache/expensive')->getPool();

        $client = \Softonic\OAuth2\Guzzle\Middleware\ClientBuilder::build(
            $provider,
            $config,
            $cache,
            ['base_uri' => $_ENV['URL_SITE_COMMUNITY']]
        );

        return $client;
    }
}
