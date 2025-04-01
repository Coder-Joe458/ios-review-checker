const assert = require('assert');
const { reviewRulesCN, reviewRulesEN } = require('../../models/reviewRules');

describe('审核规则单元测试', () => {
  describe('中文规则测试', () => {
    it('应该包含5条规则', () => {
      assert.strictEqual(reviewRulesCN.length, 5);
    });

    it('每条规则应该有正确的字段', () => {
      reviewRulesCN.forEach(rule => {
        assert.ok(rule.id, '规则必须有ID');
        assert.ok(rule.category, '规则必须有类别');
        assert.ok(rule.rule, '规则必须有名称');
        assert.ok(rule.description, '规则必须有描述');
        assert.ok(rule.checkMethod, '规则必须有检查方法');
      });
    });

    it('规则应该包含隐私政策规则', () => {
      const privacyRule = reviewRulesCN.find(rule => rule.category === '隐私');
      assert.ok(privacyRule, '应该存在隐私类别的规则');
      assert.ok(privacyRule.rule.includes('隐私政策'), '规则应该关于隐私政策');
    });

    it('规则应该包含HTTPS安全规则', () => {
      const securityRule = reviewRulesCN.find(rule => rule.category === '安全');
      assert.ok(securityRule, '应该存在安全类别的规则');
      assert.ok(securityRule.rule.includes('HTTPS'), '规则应该关于HTTPS');
    });
  });

  describe('英文规则测试', () => {
    it('应该包含5条规则', () => {
      assert.strictEqual(reviewRulesEN.length, 5);
    });

    it('每条规则应该有正确的字段', () => {
      reviewRulesEN.forEach(rule => {
        assert.ok(rule.id, 'Rule must have ID');
        assert.ok(rule.category, 'Rule must have category');
        assert.ok(rule.rule, 'Rule must have name');
        assert.ok(rule.description, 'Rule must have description');
        assert.ok(rule.checkMethod, 'Rule must have check method');
      });
    });

    it('规则应该包含隐私政策规则', () => {
      const privacyRule = reviewRulesEN.find(rule => rule.category === 'Privacy');
      assert.ok(privacyRule, 'Should have Privacy category rule');
      assert.ok(privacyRule.rule.includes('privacy policy'), 'Rule should be about privacy policy');
    });

    it('规则应该包含HTTPS安全规则', () => {
      const securityRule = reviewRulesEN.find(rule => rule.category === 'Security');
      assert.ok(securityRule, 'Should have Security category rule');
      assert.ok(securityRule.rule.includes('HTTPS'), 'Rule should be about HTTPS');
    });
  });

  describe('中英文规则对应测试', () => {
    it('中英文规则数量应该相同', () => {
      assert.strictEqual(reviewRulesCN.length, reviewRulesEN.length);
    });

    it('中英文规则ID应该一一对应', () => {
      reviewRulesCN.forEach((cnRule) => {
        const enRule = reviewRulesEN.find(rule => rule.id === cnRule.id);
        assert.ok(enRule, `应该存在对应的英文规则，ID为${cnRule.id}`);
      });
    });
  });
}); 