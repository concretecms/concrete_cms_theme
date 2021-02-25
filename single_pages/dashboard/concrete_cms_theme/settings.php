<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die('Access denied');

use Concrete\Core\Form\Service\Form;
use Concrete\Core\Form\Service\Widget\PageSelector;
use Concrete\Core\Support\Facade\Application;
use Concrete\Core\Validation\CSRF\Token;

/** @var int $submitKarmaRequestPage */
/** @var int $teamsGroupFolderId */
/** @var int $teamsGroupTypeId */
/** @var bool $enableDarkMode */
/** @var Concrete\Core\Tree\Tree $tree */

$app = Application::getFacadeApplication();
/** @var Form $form */
$form = $app->make(Form::class);
/** @var PageSelector $pageSelector */
$pageSelector = $app->make(PageSelector::class);
/** @var Token $token */
$token = $app->make(Token::class);

?>

<form action="#" method="post">
    <?php echo $token->output("update_settings"); ?>

    <fieldset>
        <legend>
            <?php echo t("General"); ?>
        </legend>

        <div class="form-group">
            <?php echo $form->label("submitKarmaRequestPage", t("Submit Karma Request Page")); ?>
            <?php echo $pageSelector->selectPage("submitKarmaRequestPage", $submitKarmaRequestPage); ?>
        </div>

        <div class="form-group">
            <div class="form-check">
                <?php echo $form->checkbox("enableDarkMode", 1, $enableDarkMode, ["class" => "form-check-input"]); ?>
                <?php echo $form->label("enableDarkMode", t("Enable Dark Mode"), ["class" => "form-check-label"]); ?>
            </div>

            <div class="help-block">
                <?php echo t("If you enable this checkbox the entire theme will be rendered in the dark mode theme. If you want to enable the dark mode just for a specific page you can do so by setting a page attribute."); ?>
            </div>
        </div>
    </fieldset>

    <fieldset>
        <legend>
            <?php echo t("Teams"); ?>
        </legend>

        <div class="form-group">
            <?php echo $form->label("teamsGroupTypeId", t("Group Type")); ?>
            <?php echo $form->select("teamsGroupTypeId", \Concrete\Core\User\Group\GroupType::getSelectList(), $teamsGroupTypeId); ?>
        </div>

        <div class="form-group">
            <label class="control-label">
                <?php echo t('Parent Folder') ?>
            </label>

            <div class="controls">
                <div class="groups-tree" style="width: 460px" data-groups-tree="<?php echo $tree->getTreeID() ?>"></div>
                <?php echo $form->hidden('teamsGroupFolderId') ?>
                <script type="text/javascript">
                    $(function () {
                        $('[data-groups-tree=<?php echo $tree->getTreeID()?>]').concreteTree({
                            'treeID': '<?php echo $tree->getTreeID()?>',
                            'chooseNodeInForm': 'single',
                            'enableDragAndDrop': false,
                            ajaxData: {
                                displayOnly: 'group_folder'
                            },
                            'selectNodesByKey': [<?php echo intval($teamsGroupFolderId)?>],
                            'onSelect': function (nodes) {
                                if (nodes.length) {
                                    $('input[name=teamsGroupFolderId]').val(nodes[0]);
                                } else {
                                    $('input[name=teamsGroupFolderId]').val('');
                                }
                            }
                        });
                    });
                </script>
            </div>
        </div>
    </fieldset>

    <div class="ccm-dashboard-form-actions-wrapper">
        <div class="ccm-dashboard-form-actions">
            <div class="float-right">
                <button type="submit" class="btn btn-primary">
                    <i class="fa fa-save"></i> <?php echo t("Save"); ?>
                </button>
            </div>
        </div>
    </div>
</form>