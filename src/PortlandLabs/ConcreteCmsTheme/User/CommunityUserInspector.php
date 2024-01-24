<?php

namespace PortlandLabs\ConcreteCmsTheme\User;

use Concrete\Core\Cache\Level\ExpensiveCache;
use Concrete\Core\Database\Connection\Connection;
use Concrete\Core\Entity\User\User;
use PortlandLabs\ConcreteCmsTheme\Community\Api\ClientBuilder;

class CommunityUserInspector
{

    public function __construct(
        protected Connection $db,
        protected ClientBuilder $clientBuilder,
        protected ExpensiveCache $cache,
    ) {
    }

    public function getCommunityUserData(User $user): ?array
    {
        $cacheKey = '/community/user/' . $user->getUserID();
        $cacheItem = $this->cache->getItem($cacheKey);
        if ($cacheItem->isMiss()) {
            $data = null;
            if ($this->clientBuilder->isEnabled()) {
                $remoteId = $this->db->fetchOne(
                    'select binding from OauthUserMap where namespace in ("external_concrete5", "external_concrete") and user_id=:user',
                    [
                        ':user' => $user->getUserID()
                    ]
                );
                if ($remoteId) {
                    $client = $this->clientBuilder->getClient();
                    $contents = $client->request(
                        'GET',
                        '/api/v1/users/' . $remoteId
                    )->getBody()->getContents();
                    if ($contents) {
                        $data = json_decode($contents, true);
                    }
                }
            }
            $cacheItem->set($data)->save();
        } else {
            $data = $cacheItem->get();
        }

        return $data;
    }


}
