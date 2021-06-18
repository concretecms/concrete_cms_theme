<?php

declare(strict_types=1);

namespace PortlandLabs\ConcreteCmsTheme\Navigation;

use Concrete\Core\Application\ApplicationAwareInterface;
use Concrete\Core\Application\ApplicationAwareTrait;
use Concrete\Core\Navigation\Item\Item;
use Concrete\Core\Navigation\Navigation;
use Concrete\Core\Navigation\NavigationInterface;
use Concrete\Core\Navigation\NavigationModifier;
use Concrete\Core\User\User;
use Concrete\Core\Validation\CSRF\Token;
use PortlandLabs\ConcreteCmsTheme\Navigation\Modifier\SiteUrlPlaceholderModifier;

class MyAccountNavigationFactory implements NavigationFactoryInterface, ApplicationAwareInterface
{

    use ApplicationAwareTrait;

    use NavigationFactoryTrait;

    /** @var User */
    protected $user;

    /** @var Token */
    protected $token;

    public function __construct(User $user, Token $token)
    {
        $this->user = $user;
        $this->token = $token;
    }

    public function createNavigation(): NavigationInterface
    {
        $navigation =  $this->user->checkLogin() ? $this->loggedInMenu() : $this->loggedOutMenu();
        $modifier = new NavigationModifier();
        $modifier->addModifier($this->app->make(SiteUrlPlaceholderModifier::class));
        return $modifier->process($navigation);
    }

    private function loggedInMenu(): NavigationInterface
    {
        $navigation = new Navigation();
        $navigation->add(new Item('{{community}}/members/profile', '<i class="fa fa-user" title="My Account"></i>', false, $this->activeSection === 'community', [
            new Item('{{community}}/members/profile/', t('My Profile')),
            new Item('{{community}}/account/messages', t('Private Messages')),

            new Item('{{marketplace}}/profile/bank', t('Purchase History')),
            new Item('{{marketplace}}/profile/projects', t('Projects')),

            new Item('/login/do_logout/' . $this->token->generate('do_logout'), t('Sign Out')),
        ]));

        return $navigation;
    }

    private function loggedOutMenu(): NavigationInterface
    {
        $navigation = new Navigation();
        $navigation->add(new Item('/login', '<i class="fa fa-user" title="Login"></i>', false, false));
        return $navigation;
    }
}
