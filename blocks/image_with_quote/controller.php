<?php /** @noinspection PhpInconsistentReturnPointsInspection */

/**
 * @project:   Concrete CMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

namespace Concrete\Package\ConcreteCmsTheme\Block\ImageWithQuote;

use Concrete\Core\Block\BlockController;
use Concrete\Core\Entity\File\File as FileEntity;
use Concrete\Core\File\File;
use Concrete\Core\Form\Service\Validation;

class Controller extends BlockController
{
    protected $btTable = "btImageWithQuote";

    // Background options
    const BACKGROUND_WHITE = 'white';
    const BACKGROUND_BLUE = 'blue';
    const BACKGROUND_LIGHT_GRAY = 'light-gray';
    const BACKGROUND_DARK_GRAY = 'dark-gray';

    // Alignment options
    const ALIGNMENT_LEFT = 'left';
    const ALIGNMENT_RIGHT = 'right';

    public function getBlockTypeDescription()
    {
        return t('Integrate feature items into your site with image support.');
    }

    public function getBlockTypeName()
    {
        return t('Image with Quote');
    }

    private function setDefaults()
    {
        $backgroundOptions = [
            self::BACKGROUND_WHITE => t("White"),
            self::BACKGROUND_BLUE => t("Blue"),
            self::BACKGROUND_LIGHT_GRAY => t("Light Gray"),
            self::BACKGROUND_DARK_GRAY => t("Dark Gray")
        ];

        $alignmentOptions = [
            self::ALIGNMENT_LEFT => t("Left"),
            self::ALIGNMENT_RIGHT => t("Right")
        ];

        $this->set("image", File::getByID($this->get("fID")));
        $this->set("backgroundOptions", $backgroundOptions);
        $this->set("alignmentOptions", $alignmentOptions);
    }

    public function add()
    {
        $this->setDefaults();

        $this->set("quote", "");
        $this->set("name", "");
        $this->set("background", self::BACKGROUND_WHITE);
        $this->set("alignment", self::ALIGNMENT_LEFT);
    }

    public function validate($args)
    {
        $e = parent::validate($args);

        /** @var Validation $formValidator */
        $formValidator = $this->app->make(Validation::class);

        $formValidator->setData($args);
        $formValidator->addRequired("name", t("You need to enter a name."));
        $formValidator->addRequired("quote", t("You need to enter a quote."));
        $formValidator->addRequired("quote", t("You need to enter a quote."));
        $formValidator->addRequired("background", t("You need to select the background color schema."));
        $formValidator->addRequired("alignment", t("You need to select the alignment."));

        if (!$formValidator->test()) {
            $e = $formValidator->getError();
        }

        if (!File::getByID($args["fID"]) instanceof FileEntity) {
            $e->add(t("You need to select a valid image."));
        }

        return $e;
    }

    public function view()
    {
        $this->setDefaults();
    }

    public function edit()
    {
        $this->setDefaults();
    }
}
