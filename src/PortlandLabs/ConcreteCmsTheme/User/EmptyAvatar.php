<?php

namespace PortlandLabs\ConcreteCmsTheme\User;

use Concrete\Core\Config\Repository\Repository;
use Concrete\Core\User\Avatar\AvatarInterface;
use HtmlObject\Image;

class EmptyAvatar implements AvatarInterface
{

    public function getPath()
    {
        return app(Repository::class)->get('concrete.icons.user_avatar.default');
    }

    public function output()
    {
        $img = new Image();
        $img->src($this->getPath())->class('u-avatar');
        return (string) $img;
    }


}
