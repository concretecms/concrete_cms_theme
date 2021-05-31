<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

namespace PortlandLabs\ConcreteCmsTheme\Provider;

use Concrete\Core\Application\Application;
use Concrete\Core\Config\Repository\Repository;
use Concrete\Core\Foundation\Service\Provider;
use Concrete\Core\Html\Service\Navigation;
use Concrete\Core\Http\Response;
use Concrete\Core\Http\ResponseFactory;
use Concrete\Core\Package\PackageService;
use Concrete\Core\Page\Page;
use Concrete\Core\Page\Theme\ThemeRouteCollection;
use Concrete\Core\Routing\Router;
use Concrete\Core\Search\Pagination\View\ManagerServiceProvider as CorePaginationManager;
use Concrete\Package\ConcreteCmsTheme\Controller;
use PortlandLabs\ConcreteCmsTheme\API\OAuth\Controller as OAuthController;
use PortlandLabs\ConcreteCmsTheme\API\V1\Messages;
use PortlandLabs\ConcreteCmsTheme\API\V1\Middleware\FractalNegotiatorMiddleware;
use PortlandLabs\ConcreteCmsTheme\Navigation\HeaderNavigationFactory;
use PortlandLabs\ConcreteCmsTheme\Search\Pagination\View\ManagerServiceProvider;
use PortlandLabs\ConcreteCmsTheme\Search\Pagination\View\PagerManager;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use PortlandLabs\ConcreteCmsTheme\Search\Pagination\View\Manager;

class ServiceProvider extends Provider
{
    protected $eventDispatcher;
    protected $responseFactory;
    protected $navigationHelper;
    protected $router;
    protected $themeRouteCollection;
    protected $config;
    protected $packageService;
    /** @var Controller */
    protected $pkg;

    public function __construct(
        Application $app,
        EventDispatcherInterface $eventDispatcher,
        ResponseFactory $responseFactory,
        Navigation $navigationHelper,
        ThemeRouteCollection $themeRouteCollection,
        Router $router,
        Repository $config,
        PackageService $packageService
    )
    {
        parent::__construct($app);

        $this->eventDispatcher = $eventDispatcher;
        $this->responseFactory = $responseFactory;
        $this->navigationHelper = $navigationHelper;
        $this->themeRouteCollection = $themeRouteCollection;
        $this->router = $router;
        $this->config = $config;
        $this->packageService = $packageService;
        $pkgEntity = $this->packageService->getByHandle("concrete_cms_theme");
        $this->pkg = $pkgEntity->getController();
    }

    public function register()
    {
        $this->registerPageSelectorRedirect();
        $this->registerAPI();
        $this->registerAssetLocalizations();
        $this->overrideOAuthController();
        $this->registerPagination();
        $this->registerThemePaths();
        $this->registerNavigations();
        $this->changeAvatarIcon();
        $this->changeLanguageSwitcherRoutes();
    }

    private function changeLanguageSwitcherRoutes()
    {
        $this->router->register("/ccm/language_switcher/switch_language/{currentPageID}/{sectionID}", "\Concrete\Block\SwitchLanguage\Controller::action_switch_language");
    }

    private function changeAvatarIcon()
    {
        $this->config->set("concrete.icons.user_avatar.default", $this->pkg->getRelativePath() . "/images/avatar_none.png");
    }

    private function registerNavigations()
    {
        $this->app->singleton(HeaderNavigationFactory::class);
    }

    private function registerThemePaths()
    {
        if (!$this->themeRouteCollection->getThemeByRoute('/account')) {
            $this->themeRouteCollection->setThemeByRoute('/account', 'concrete_cms_theme');
        }
        if (!$this->themeRouteCollection->getThemeByRoute('/account/*')) {
            $this->themeRouteCollection->setThemeByRoute('/account/*', 'concrete_cms_theme');
        }

        $this->themeRouteCollection->setThemeByRoute('/register', 'concrete_cms_theme');
        $this->themeRouteCollection->setThemeByRoute('/login', 'concrete_cms_theme');
        $this->themeRouteCollection->setThemeByRoute('/oauth/authorize', 'concrete_cms_theme');
    }

    private function registerPagination()
    {
        $this->app->bind('manager/view/pagination', function ($app) {
            return new Manager($app);
        });
        $this->app['manager/view/pagination/pager'] = $this->app->share(function ($app) {
            return new PagerManager($app);
        });

        $this->app->bind(CorePaginationManager::class, ManagerServiceProvider::class);
    }

    private function overrideOAuthController()
    {
        /*
         * It is required to override the OAuth controller to manipulate the login view
         */
        /** @noinspection PhpParamsInspection */
        $this->router->post('/oauth/2.0/token', [OAuthController::class, 'token']);
        /** @noinspection PhpParamsInspection */
        $this->router->all('/oauth/2.0/authorize', [OAuthController::class, 'authorize']);
    }

    private function registerPageSelectorRedirect()
    {
        $this->eventDispatcher->addListener('on_before_render', function () {
            $page = Page::getCurrentPage();

            if ($page instanceof Page && !$page->isError()) {
                $targetPageId = (int)$page->getAttribute('page_selector_redirect');

                if ($targetPageId > 0) {
                    $targetPage = Page::getByID($targetPageId);

                    if ($targetPage instanceof Page && !$targetPage->isError()) {
                        if ($targetPage->isExternalLink()) {
                            $targetPageUrl = $targetPage->getCollectionPointerExternalLink();
                        } else {
                            /** @noinspection PhpParamsInspection */
                            $targetPageUrl = $this->navigationHelper->getLinkToCollection($targetPage);
                        }

                        $this->responseFactory->redirect($targetPageUrl, Response::HTTP_TEMPORARY_REDIRECT)->send();
                        $this->app->shutdown();
                    }
                }
            }
        });
    }

    protected function registerAPI()
    {
        $this->router->buildGroup()
            ->setPrefix('/api/v1')
            ->addMiddleware(FractalNegotiatorMiddleware::class)
            ->routes(function ($groupRouter) {
                /**
                 * @var $groupRouter Router
                 */
                $groupRouter->get('/messages/compose', [Messages::class, 'compose']);
                $groupRouter->post('/messages/send', [Messages::class, 'send']);
                $groupRouter->post('/messages/read', [Messages::class, 'read']);
                $groupRouter->post('/messages/unread', [Messages::class, 'unread']);
                $groupRouter->post('/messages/delete', [Messages::class, 'delete']);
            });
    }

    protected function registerAssetLocalizations()
    {
        $this->router->get('/community/js', 'PortlandLabs\ConcreteCmsTheme\Controller\Frontend\AssetsLocalization::getCommunityJavascript');
    }
}
