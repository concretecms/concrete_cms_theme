<?php

namespace PortlandLabs\ConcreteCmsTheme\User;

use Concrete\Core\Entity\User\User;
use Concrete\Core\User\Avatar\AvatarInterface;
use PortlandLabs\ConcreteCmsTheme\User\EmptyAvatar;
use League\Url\Url;

class CommunityUser
{

    public function __construct(
        public readonly User $author
    ) {
    }

    public function getUserDisplayName(): string
    {
        $data = app(CommunityUserInspector::class)->getCommunityUserData($this->author);
        $firstName = null;
        $lastName = null;
        if (isset($data['users']['id'])) {
            foreach ($data['users']['custom_attributes']['custom_attributes'] as $attribute) {
                if ($attribute['handle'] === 'first_name') {
                    $firstName = $attribute['value'];
                }
                if ($attribute['handle'] === 'last_name') {
                    $lastName = $attribute['value'];
                }
            }
            if ($firstName && $lastName) {
                return $firstName . ' ' . $lastName;
            }
        }
        return (string) $this->author->getUserName();
    }

    public function getCommunityUserId(): ?int
    {
        $data = app(CommunityUserInspector::class)->getCommunityUserData($this->author);
        if (isset($data['users']['id'])) {
            return (int) $data['users']['id'];
        }
        return null;
    }

    public function getUserProfileUrl(): Url
    {
        $url = Url::createFromUrl($_ENV['URL_SITE_COMMUNITY']);
        $url->setPath('/members/profile/' . $this->getCommunityUserId());
        return $url;
    }

    public function getUserAvatar(): AvatarInterface
    {
        $data = app(CommunityUserInspector::class)->getCommunityUserData($this->author);
        if (!empty($data['users']['avatar'])) {
            return new CommunityUserAvatar($data['users']['avatar'], $data['users']['username']);
        }
        return new EmptyAvatar();
    }

}
