<?php

namespace PortlandLabs\ConcreteCmsTheme\User;

use Concrete\Core\Entity\User\User;
use Concrete\Core\User\Avatar\AvatarInterface;
use Concrete\Core\User\Avatar\EmptyAvatar;

class CommunityUser
{

    public function __construct(
        public readonly User $author
    ) {
    }

    public function getUserDisplayName(): string
    {
        $data = app(CommunityUserInspector::class)->getCommunityUserData($this->author);
        if (isset($data['users']['id'])) {
            foreach ($data['users']['custom_attributes']['custom_attributes'] as $attribute) {
                if ($attribute['handle'] === 'first_name') {
                    $firstName = $attribute['value'];
                }
                if ($attribute['handle'] === 'first_name') {
                    $lastName = $attribute['value'];
                }
            }
            return $firstName . ' ' . $lastName;
        } else {
            return $this->author->getUserName();
        }
    }

    public function getUserAvatar(): AvatarInterface
    {
        $avatar = app(EmptyAvatar::class, ['userInfo' => $this->author->getUserInfoObject()]);
        return $avatar;
    }

}
