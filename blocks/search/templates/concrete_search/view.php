<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

use Concrete\Core\Form\Service\Form;
use Concrete\Core\Http\Request;
use Concrete\Core\Page\Page;
use Concrete\Core\Search\Pagination\Pagination;
use Concrete\Core\Support\Facade\Application;
use Concrete\Core\Utility\Service\Text;
use Concrete\Core\View\View;

defined('C5_EXECUTE') or die('Access Denied.');

/** @var bool $do_search */
/** @var Pagination $pagination */
/** @var Page[] $results */
/** @var bool $searchAll */
/** @var bool $allowUserOptions */
/** @var string $query */
/** @var string $baseSearchPath */
/** @var string $resultTarget */
/** @var $view View */
$app = Application::getFacadeApplication();
/** @var Text $tt */
$tt = $app->make(Text::class);
/** @var Form $form */
$form = $app->make(Form::class);
/** @var Request $request */
$request = $app->make(Request::class);
?>

<?php if (isset($error)) { ?>
    <?php echo $error ?>
    <br/><br/>
<?php } ?>

<?php if (!isset($query) || !is_string($query)) {
    $query = '';
}

?>

<form action="<?php /** @noinspection PhpDeprecationInspection */
echo $view->url($resultTarget) ?>" method="get" class="ccm-search-block-form">
    <?php if (isset($title) && ($title !== '')) { ?>
        <h3>
            <?php echo h($title) ?>
        </h3>
    <?php } ?>

    <?php if ($query === '') { ?>
        <?php echo $form->hidden("search_paths[]", $baseSearchPath); ?>
    <?php } elseif ($request->query->has("search_paths") && is_array($request->query->get("search_paths"))) { ?>
        <?php foreach ($request->query->get("search_paths") as $search_path) { ?>
            <?php if (is_string($search_path)) { ?>
                <?php echo $form->hidden("search_paths[]", $search_path); ?>
            <?php } ?>
        <?php } ?>
    <?php } ?>

    <?php if (!isset($buttonText) || $buttonText == '') { ?>

        <div class="form-group">
            <?php echo $form->label("query", t("Query")); ?>
            <?php echo $form->text("query", $query, ["class" => "ccm-search-block-text form-control"]); ?>
        </div>
    <?php } else { ?>

        <div class="form-group">
            <?php echo $form->label("query", t("Query")); ?>

            <div class="input-group">
                <?php echo $form->text("query", $query, ["class" => "ccm-search-block-text form-control"]); ?>

                <div class="input-group-append">
                    <?php echo $form->submit("submit", $buttonText, ["class" => "ccm-search-block-submit btn-primary"]); ?>
                </div>
            </div>
        </div>
    <?php } ?>

    <?php if ($allowUserOptions) { ?>
        <div>
            <h5>
                <?php echo t('Advanced Search Options') ?>
            </h5>

            <div class="form-check">
                <?php echo $form->checkbox("options", "ALL", $searchAll, ["class" => "form-check-input", "id" => "optionsAll"]); ?>
                <?php echo $form->label("optionsAll", t('Search All Sites'), ["class" => "form-check-label"]); ?>
            </div>

            <div class="form-check">
                <?php echo $form->checkbox("options", "CURRENT", $searchAll, ["class" => "form-check-input", "id" => "optionsAll"]); ?>
                <?php echo $form->label("optionsAll", t('Search Current Site'), ["class" => "form-check-label"]); ?>
            </div>
        </div>
    <?php } ?>

    <?php if (isset($do_search) && $do_search) {
        if (count($results) == 0) { ?>
            <p>
                <?php echo t('There were no results found. Please try another keyword or phrase.') ?>
            </p>
        <?php } else { ?>
            <div id="searchResults">
                <?php foreach ($results as $r) { ?>
                    <?php $currentPageBody = $this->controller->highlightedExtendedMarkup($r->getPageIndexContent(), $query); ?>

                    <div class="searchResult">
                        <h3>
                            <a href="<?php echo $r->getCollectionLink() ?>">
                                <?php echo $r->getCollectionName() ?>
                            </a>
                        </h3>

                        <p>
                            <?php if ($r->getCollectionDescription()) { ?>
                                <?php echo $this->controller->highlightedMarkup($tt->shortText($r->getCollectionDescription()), $query); ?>
                                <br/>
                            <?php } ?>

                            <?php echo $currentPageBody; ?>

                            <br/>

                            <a href="<?php echo $r->getCollectionLink() ?>" class="pageLink">
                                <?php echo $this->controller->highlightedMarkup($r->getCollectionLink(), $query) ?>
                            </a>
                        </p>
                    </div>
                <?php } ?>
            </div>

            <div class="pagination-container">
                <?php
                $pages = $pagination->getCurrentPageResults();
                if ($pagination->haveToPaginate()) {
                    $showPagination = true;
                    echo $pagination->renderView('application');
                }
                ?>
            </div>
        <?php } ?>
    <?php } ?>
</form>
