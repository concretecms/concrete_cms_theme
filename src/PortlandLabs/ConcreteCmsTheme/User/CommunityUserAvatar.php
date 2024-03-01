<?php

namespace PortlandLabs\ConcreteCmsTheme\User;

use Concrete\Core\User\Avatar\AvatarInterface;
use HtmlObject\Image;

/**
 * For use with the community user inspector - the inspector retrieves the avatar from the REST API, and then populates
 * this avatar for use with things like the marketplace sidebar.
 */
class CommunityUserAvatar implements AvatarInterface
{

    public function __construct(
        protected string $path,
        protected string $username,
    ) {
    }

    public function getPath()
    {
        return $this->path;
    }

    public function output()
    {
        $img = new Image();
        $img->src($this->getPath())->class('u-avatar')->alt(h($this->username));
        return (string)$img;
    }


}
