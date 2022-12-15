<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die("Access Denied.");

use Concrete\Core\Area\GlobalArea;
use Concrete\Core\Page\Page;
use Concrete\Core\User\User;
use Concrete\Core\View\View;
use Concrete\Core\Support\Facade\Url;
use Concrete\Core\Support\Facade\Application;
use Concrete\Core\Config\Repository\Repository;
use PortlandLabs\ConcreteCmsTheme\Navigation\UrlManager;

/** @var View $view */

$app = Application::getFacadeApplication();
/** @var Repository $config */
$config = Site::getSite()->getConfigRepository();
$u = new User();

$manager = $app->make(UrlManager::class);
$marketingUrl = $manager->getMarketingUrl();
$opensourceUrl = $manager->getMarketingOrgUrl();

$enableDarkMode = false;
if (isset($c)) {
    $enableDarkMode = $config->get("concrete_cms_theme.enable_dark_mode") || ($c instanceof Page ? $c->getAttribute(
            "enable_dark_mode"
        ) : false);
}
?>
<footer>
    <div class="container">
        <div class="row">
            <div class="col-lg">
                <nav class="nav footer-nav-utility">
                    <a class="nav-link" href="<?=$opensourceUrl?>/security"><?=t('Security')?></a>
                    <a class="nav-link" href="<?=$marketingUrl?>/about/legal/terms-use"><?=t('Terms of Use')?></a>
                    <a class="nav-link" href="<?=$marketingUrl?>/about/legal/privacy-policy"><?=t('Privacy Policy')?></a>
                    <a class="nav-link" href="<?=$marketingUrl?>/about/contact-us"><?=t('Contact')?></a>
                </nav>
            </div>

            <div class="col-lg">
                <div class="text-center text-lg-end">
                    <div class="footer-social">
                        <?php
                        $a = new GlobalArea('Footer Social');
                        $a->display();
                        ?>
                    </div>
                </div>
            </div>

        </div>

        <div class="row">
            <div class="col-lg">
                <div class="text-center text-lg-start footer-site-title">
                    <?php if ($enableDarkMode) { ?>
                        <a href="<?=(string) $opensourceUrl?>">
                            <img src="<?=$view->getThemePath()?>/images/logo_text_dark_mode.svg" alt="" class="img-fluid">
                        </a>
                    <?php } else { ?>
                        <a href="<?=(string) $marketingUrl?>">
                            <img src="<?=$view->getThemePath()?>/images/logo_text.svg" alt="" class="img-fluid">
                        </a>
                    <?php } ?>
                    </a>
                </div>
            </div>

            <div class="col-lg">
                <div class="text-center text-lg-start">
                    <div class="footer-language-switcher d-flex">

                        <?php
                        /** @noinspection PhpUnhandledExceptionInspection */
                        if ($_ENV['SHOW_LANGUAGE_SWITCHER'] ?? false) {
                            View::element("language_switcher", ["label" => t("Language:")], "concrete_cms_theme");
                        }
                        //$a = new GlobalArea('Footer Language Switcher');
                        //$a->display($c);
                        ?>
                    </div>
                </div>
            </div>

            <div class="col-lg">
                <div class="text-center text-lg-end">
                    <div class="footer-legal">
                        <p>
                            <span class="sign">&copy;</span> <?php echo t("PortlandLabs %s-%s", 2008, date('Y')); ?>
                        </p>
                    </div>
                </div>
            </div>
        </div>

    </div>
</footer>

</div>
<?php
/** @noinspection PhpUnhandledExceptionInspection */
View::element('footer_required');
?>
<script src="<?php echo (string)Url::to("/community/js"); ?>" defer></script>
<!--suppress HtmlUnknownTarget -->
<script type="text/javascript" src="<?php echo $view->getThemePath() ?>/js/bootstrap.js" defer></script>
<script type="text/javascript" src="<?php echo $view->getThemePath() ?>/js/main.js" defer></script>
<script>
    $(window).ready(function () {
        if (window.self !== window.top) {
            $(".login-page").addClass("is-popup")
        }
    });
</script>
<?php if ($u->isRegistered()) {?>
    <script>
        if (window.self !== window.top) {
            window.parent.closeIframe(true);
        }
    </script>
<?php } ?>
</body>
</html>
