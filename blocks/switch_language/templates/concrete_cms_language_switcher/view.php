<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die('Access Denied.');

use Concrete\Block\SwitchLanguage\Controller;
use Concrete\Core\Block\View\BlockView;
use Concrete\Core\Form\Service\Form;
use Concrete\Core\Localization\Localization;
use Concrete\Core\Multilingual\Page\Section\Section;
use Concrete\Core\Multilingual\Service\UserInterface\Flag;
use Concrete\Core\Page\Page;
use Concrete\Core\Permission\Checker;
use Concrete\Core\Support\Facade\Application;

/* @var Controller $controller */
/* @var BlockView $view */
/* @var string $label */
/* @var array $languages */
/* @var Section[] $languageSections */
/* @var int|null $activeLanguage */
/* @var Section $defaultLocale */
/* @var string $locale */
/* @var int $cID */
$app = Application::getFacadeApplication();
/** @var Flag $ih */
$ih = $app->make(Flag::class);
/** @var Form $form */
$form = $app->make(Form::class);
$c = Page::getCurrentPage();


/** @var Section[] $ml */
$ml = Section::getList();
$al = Section::getBySectionOfSite($c);
$languages = [];
$locale = null;

if ($al !== null) {
    $locale = $al->getLanguage();
}

if (!$locale) {
    $locale = Localization::activeLocale();
    $al = Section::getByLocale($locale);
}

$mlAccessible = [];

foreach ($ml as $m) {
    $pc = new Checker(Page::getByID($m->getCollectionID()));
    /** @noinspection PhpUndefinedMethodInspection */
    if ($pc->canRead()) {
        $mlAccessible[] = $m;
        $languages[$m->getCollectionID()] = strtoupper($m->getLocaleObject()->getLanguage());
    }
}

$activeLanguage = $al->getCollectionID();

?>

<div class="ccm-block-switch-language-flags">
    <div class="ccm-block-switch-language-flags-label">
        <?php echo $label ?>
    </div>

    <form method="post">
        <div class="ccm-block-switch-language-flags-dropdown">

            <div class="ccm-block-switch-language-flags-icon">
                <?php echo $ih->getSectionFlagIcon($c) ?>
            </div>

            <?php echo $form->select(
                'language',
                $languages,
                $activeLanguage,
                [
                    'data-select' => 'multilingual-switch-language',
                    'data-action' => $view->action('switch_language', $cID, '--language--'),
                ]
            ) ?>
        </div>
    </form>
</div>

<div class="clearfix"></div>